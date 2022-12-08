import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  EntityPaginationType,
  SearchFiltersType,
  UserType,
} from '../../types/types';
import { InjectModel } from '@nestjs/mongoose';
import { ConvertFiltersForDB } from '../../common/queries/convertFiltersForDB';

@Injectable()
export class UsersRepository {
  constructor(
    protected creatFiltersForDB: ConvertFiltersForDB,
    @InjectModel('users') private usersModel: mongoose.Model<UserType>,
  ) {}

  async findUsers(
    entityFindUsers: EntityPaginationType,
    searchFilters: SearchFiltersType,
  ): Promise<UserType[]> {
    const convertedForDBFilters = await this.creatFiltersForDB.prepForUser(
      searchFilters,
    );
    return await this.usersModel
      .find(
        {
          $and: convertedForDBFilters,
        },
        {
          _id: false,
          __v: false,
          'accountData.passwordHash': false,
          'accountData.passwordSalt': false,
          emailConfirmation: false,
          registrationData: false,
        },
      )
      .limit(entityFindUsers.pageSize)
      .skip(entityFindUsers.startIndex)
      .sort({ [entityFindUsers.field]: entityFindUsers.direction })
      .lean();
  }
  async createOrUpdateUser(user: UserType): Promise<UserType | null> {
    try {
      await this.usersModel.findOneAndUpdate(
        { 'accountData.id': user.accountData.id },
        { $set: user },
        { upsert: true },
      );
      return user;
    } catch (e: any) {
      console.log(e.toString());
      return null;
    }
  }

  async updateUser(user: UserType) {
    return await this.usersModel.updateOne(
      { 'accountData.id': user.accountData.id },
      { $set: user },
    );
  }

  async countDocuments(searchFilters: SearchFiltersType) {
    const convertedForDBFilters = await this.creatFiltersForDB.prepForUser(
      searchFilters,
    );
    return await this.usersModel.countDocuments({
      $and: convertedForDBFilters,
    });
  }

  async findByLoginAndEmail(
    email: string,
    login: string,
  ): Promise<UserType | null> {
    return await this.usersModel.findOne({
      $and: [{ 'accountData.email': email }, { 'accountData.login': login }],
    });
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserType | null> {
    return await this.usersModel.findOne({
      $or: [
        { 'accountData.login': { $eq: loginOrEmail } },
        { 'accountData.email': { $eq: loginOrEmail } },
      ],
    });
  }

  async findByConfirmationCode(code: string): Promise<UserType | null> {
    return await this.usersModel.findOne(
      {
        $and: [
          { 'emailConfirmation.confirmationCode': code },
          { 'emailConfirmation.isConfirmed': false },
          {
            'emailConfirmation.expirationDate': {
              $gt: new Date().toISOString(),
            },
          },
        ],
      },
      {
        _id: false,
        __v: false,
        'registrationData._id': false,
        'emailConfirmation.sentEmail._id': false,
      },
    );
  }

  async findUserByUserId(userId: string): Promise<UserType | null> {
    return await this.usersModel.findOne({ 'accountData.id': userId });
  }

  async findUserByEmailAndCode(
    email: string,
    code: string,
  ): Promise<UserType | null> {
    return await this.usersModel.findOne({
      $and: [
        { 'emailConfirmation.confirmationCode': code },
        { 'accountData.email': email },
      ],
    });
  }

  async findUserByConfirmationCode(code: string): Promise<UserType | null> {
    return await this.usersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
  }

  async updateUserConfirmationCode(user: UserType) {
    return await this.usersModel.findOneAndUpdate(
      { 'accountData.email': user.accountData.email },
      { $set: user },
    );
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({ 'accountData.id': id });
    return result.acknowledged && result.deletedCount === 1;
  }

  async findByIsNotConfirmedAndCreatedAt(): Promise<number> {
    const result = await this.usersModel.deleteMany({
      'emailConfirmation.isConfirmed': false,
      'registrationData.createdAt': {
        $lt: new Date(Date.now() - 1000 * 60).toISOString(),
      },
    }); // We delete users who have not confirmed their email within 1 hour = - 1000 * 60 * 60
    return result.deletedCount;
  }

  async addTimeOfSentEmail(
    emailAndCode: EmailConfirmCodeType | EmailRecoveryCodeType,
  ): Promise<boolean> {
    return await this.usersModel
      .findOneAndUpdate(
        { 'accountData.email': emailAndCode.email },
        { $push: { 'emailConfirmation.sentEmail': new Date().toISOString() } },
        { returnDocument: 'after' },
      )
      .lean();
  }
}
