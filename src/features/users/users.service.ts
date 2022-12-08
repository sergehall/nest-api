import * as bcrypt from 'bcrypt';
import * as uuid4 from 'uuid4';
import { Injectable } from '@nestjs/common';
import {
  DTONewUser,
  DtoQueryType,
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  EntityPaginationType,
  Pagination,
  QueryPaginationType,
  UserType,
} from '../../types/types';
import { UsersRepository } from './users.repository';
import { EmailsRepository } from '../emails/emails.repository';

@Injectable()
export class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected emailsRepository: EmailsRepository,
  ) {}

  async findUsers(
    dtoPagination: QueryPaginationType,
    dtoQuery: DtoQueryType,
  ): Promise<Pagination> {
    const startIndex = (dtoPagination.pageNumber - 1) * dtoPagination.pageSize;
    const pageSize = dtoPagination.pageSize;
    let field = 'createdAt';
    if (dtoPagination.sortBy === 'login' || dtoPagination.sortBy === 'email') {
      field = 'accountData.' + dtoPagination.sortBy;
    }
    const direction = dtoPagination.sortDirection;

    const entityFindUsers: EntityPaginationType = {
      startIndex,
      pageSize,
      field,
      direction,
    };

    const users = await this.usersRepository.findUsers(
      entityFindUsers,
      dtoQuery,
    );
    // count documents by filterLogin and filterEmail
    const countDocuments = await this.usersRepository.countDocuments(dtoQuery);

    const pagesCount = Math.ceil(countDocuments / pageSize);
    return {
      pagesCount: pagesCount,
      page: dtoPagination.pageNumber,
      pageSize: pageSize,
      totalCount: countDocuments,
      items: users,
    };
  }

  async createUser(dtoNewUser: DTONewUser): Promise<UserType | null> {
    const newUser: UserType = await this._createNewUser(
      dtoNewUser.login,
      dtoNewUser.password,
      dtoNewUser.email,
      dtoNewUser.clientIp,
      dtoNewUser.userAgent,
    );
    return await this.usersRepository.createOrUpdateUser(newUser);
  }

  async createUserRegistration(
    login: string,
    email: string,
    password: string,
    clientIp: string | null,
    userAgent: string,
  ): Promise<UserType | null> {
    const newUser: UserType = await this._createNewUser(
      login,
      password,
      email,
      clientIp,
      userAgent,
    );
    const createUser = await this.usersRepository.createOrUpdateUser(newUser);
    try {
      if (!createUser) {
        return null;
      }
      const newDataUserEmailConfirmationCode = {
        email: createUser.accountData.email,
        confirmationCode: createUser.emailConfirmation.confirmationCode,
        createdAt: new Date().toISOString(),
      };
      await this.emailsRepository.insertEmailConfirmCode(
        newDataUserEmailConfirmationCode,
      );

      return createUser;
    } catch (e) {
      console.log(e);
      await this.usersRepository.deleteUserById(newUser.accountData.id);
      return null;
    }
  }

  async confirmByEmail(email: string, code: string): Promise<UserType | null> {
    const user = await this.usersRepository.findUserByEmailAndCode(email, code);
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
          user.emailConfirmation.isConfirmed = true;
          const result = await this.usersRepository.updateUser(user);
          if (result.matchedCount !== 1) {
            return null;
          }
          return user;
        }
      }
    }
    return null;
  }

  async confirmByCodeInParams(code: string): Promise<UserType | null> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (user) {
      if (!user.emailConfirmation.isConfirmed) {
        if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
          user.emailConfirmation.isConfirmed = true;
          await this.usersRepository.updateUser(user);
          return user;
        }
      }
    }
    return null;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
    return await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
  }

  async findByConfirmationCode(code: string): Promise<UserType | null> {
    return await this.usersRepository.findByConfirmationCode(code);
  }

  async countEmailsSentLastHour(code: string): Promise<number> {
    let countSentEmails = 0;
    const currentUser: UserType | null =
      await this.usersRepository.findUserByConfirmationCode(code);
    if (currentUser) {
      countSentEmails = currentUser.emailConfirmation.sentEmail.map(
        (i) => i > new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      ).length;
    }
    return countSentEmails;
  }

  async deleteUserWithRottenCreatedAt(): Promise<number> {
    return await this.usersRepository.findByIsNotConfirmedAndCreatedAt();
  }

  async sentRecoveryCodeByEmailUserExist(user: UserType) {
    await this.emailsRepository.insertEmailRecoveryCode({
      email: user.accountData.email,
      recoveryCode: user.emailConfirmation.confirmationCode,
      createdAt: new Date().toISOString(),
    });
    return user;
  }

  async sentRecoveryCodeByEmailUserNotExist(email: string) {
    const newEmailRecoveryCode = {
      email: email,
      recoveryCode: uuid4().toString(),
      createdAt: new Date().toISOString(),
    };
    await this.emailsRepository.insertEmailRecoveryCode(newEmailRecoveryCode);
    return newEmailRecoveryCode;
  }

  async updateAndSentConfirmationCodeByEmail(email: string) {
    const user = await this.usersRepository.findUserByLoginOrEmail(email);
    if (!user) {
      return null;
    }
    if (!user.emailConfirmation.isConfirmed) {
      if (user.emailConfirmation.expirationDate > new Date().toISOString()) {
        user.emailConfirmation.confirmationCode = uuid4().toString();
        // expiration date in an 1 hour 5 min
        user.emailConfirmation.expirationDate = new Date(
          Date.now() + 65 * 60 * 1000,
        ).toISOString();
        // update user
        await this.usersRepository.updateUserConfirmationCode(user);

        const newDataUserEmailConfirmationCode = {
          email: user.accountData.email,
          confirmationCode: user.emailConfirmation.confirmationCode,
          createdAt: new Date().toISOString(),
        };
        // add Email to emailsToSentRepository
        await this.emailsRepository.insertEmailConfirmCode(
          newDataUserEmailConfirmationCode,
        );
        return user;
      }
    }
  }

  async findUserByUserId(userId: string): Promise<UserType | null> {
    return await this.usersRepository.findUserByUserId(userId);
  }

  async findByLoginAndEmail(
    email: string,
    login: string,
  ): Promise<UserType | null> {
    return await this.usersRepository.findByLoginAndEmail(email, login);
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUserById(id);
  }

  async addTimeOfSentEmail(
    emailAndCode: EmailConfirmCodeType | EmailRecoveryCodeType,
  ): Promise<boolean> {
    return await this.usersRepository.addTimeOfSentEmail(emailAndCode);
  }

  async createNewPassword(newPassword: string, user: UserType) {
    const passwordSalt = await bcrypt.genSalt(Number(process.env.SALT_FACTOR));
    const newHash = await this._generateHash(newPassword, passwordSalt);
    const newUser: UserType = JSON.parse(JSON.stringify(user));
    newUser.accountData.passwordHash = newHash;
    return await this.usersRepository.createOrUpdateUser(newUser);
  }

  async _createNewUser(
    login: string,
    password: string,
    email: string,
    ip: string | null,
    userAgent: string,
  ) {
    const saltRounds = Number(process.env.SALT_FACTOR);
    const saltHash = await bcrypt.genSalt(saltRounds);
    const passwordHash = await this._generateHash(password, saltHash);
    const id = uuid4().toString();
    const currentTime = new Date().toISOString();
    const confirmationCode = uuid4().toString();
    // expiration date in an 1 hour 5 min
    const expirationDate = new Date(Date.now() + 65 * 60 * 1000).toISOString();
    return {
      accountData: {
        id: id,
        login: login,
        email: email,
        passwordHash: passwordHash,
        createdAt: currentTime,
      },
      emailConfirmation: {
        confirmationCode: confirmationCode,
        expirationDate: expirationDate,
        isConfirmed: false,
        sentEmail: [],
      },
      registrationData: {
        ip: ip,
        userAgent: userAgent,
      },
    };
  }

  async _generateHash(password: string, saltHash: string) {
    return await bcrypt.hash(password, saltHash);
  }
}
