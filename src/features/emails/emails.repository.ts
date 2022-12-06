import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EmailConfirmCodeType, EmailRecoveryCodeType } from '../../types/types';

@Injectable()
export class EmailsRepository {
  constructor(
    @InjectModel('MyModelEmailsConfirmCode')
    protected emailConfirmCodeType: mongoose.Model<EmailConfirmCodeType>,
    @InjectModel('MyModelEmailsRecoveryCode')
    protected emailRecoveryCodeType: mongoose.Model<EmailRecoveryCodeType>,
  ) {}
  async insertEmailConfirmCode(
    emailAndCode: EmailConfirmCodeType,
  ): Promise<boolean> {
    const findOneAndUpdateData = await this.emailConfirmCodeType.create({
      email: emailAndCode.email,
      confirmationCode: emailAndCode.confirmationCode,
      createdAt: emailAndCode.createdAt,
    });
    return findOneAndUpdateData !== null;
  }

  async findEmailByOldestDate(): Promise<EmailConfirmCodeType | null> {
    const findEmail = await this.emailConfirmCodeType
      .find({}, { _id: false })
      .sort({ createdAt: 1 })
      .limit(1);
    if (findEmail.length === 0) {
      return null;
    }
    return findEmail[0];
  }

  async deleteEmailConfirmCodeAfterSent(
    emailAndCode: EmailConfirmCodeType,
  ): Promise<boolean> {
    const result = await this.emailConfirmCodeType.deleteOne({
      $and: [
        {
          email: emailAndCode.email,
          confirmationCode: emailAndCode.confirmationCode,
        },
      ],
    });
    return result.acknowledged && result.deletedCount === 1;
  }

  async insertEmailRecoveryCode(
    emailAndCode: EmailRecoveryCodeType,
  ): Promise<boolean> {
    const findOneAndUpdateData = await this.emailRecoveryCodeType.create({
      email: emailAndCode.email,
      recoveryCode: emailAndCode.recoveryCode,
      createdAt: emailAndCode.createdAt,
    });
    return findOneAndUpdateData !== null;
  }

  async findEmailByOldestDateRecoveryCode(): Promise<EmailRecoveryCodeType | null> {
    const findData = await this.emailRecoveryCodeType
      .find({}, { _id: false })
      .sort({ createdAt: 1 })
      .limit(1);
    if (findData.length === 0) {
      return null;
    }
    return findData[0];
  }

  async deleteEmailRecoveryCodeAfterSent(
    emailAndCode: EmailRecoveryCodeType,
  ): Promise<boolean> {
    const result = await this.emailRecoveryCodeType.deleteOne({
      $and: [
        {
          email: emailAndCode.email,
          recoveryCode: emailAndCode.recoveryCode,
        },
      ],
    });
    return result.acknowledged && result.deletedCount === 1;
  }
}
