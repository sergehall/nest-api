import mongoose from 'mongoose';
import {
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  UserType,
} from '../../types/types';

export const UserSchema = new mongoose.Schema<UserType>({
  accountData: {
    id: {
      type: String,
      required: [true, 'Id is required'],
    },
    login: {
      type: String,
      required: [true, 'login is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'passwordHash is required'],
    },
    createdAt: {
      type: String,
      required: [true, 'createdAt is required'],
    },
  },
  emailConfirmation: {
    confirmationCode: {
      type: String,
      required: [true, 'confirmationCode is required'],
    },
    expirationDate: {
      type: String,
      required: [true, 'expirationDate is required'],
    },
    isConfirmed: Boolean,
    sentEmail: {
      type: [String],
      default: [],
      validate: (v: any) => Array.isArray(v),
    },
  },
  registrationData: {
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      required: [true, 'userAgent is required'],
    },
  },
});

export const EmailsToSentSchema = new mongoose.Schema<EmailConfirmCodeType>({
  email: {
    type: String,
    required: [true, 'email is required'],
  },
  confirmationCode: {
    type: String,
    required: [true, 'confirmationCode is required'],
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required'],
  },
});
export const EmailsRecoveryCodeSchema =
  new mongoose.Schema<EmailRecoveryCodeType>({
    email: {
      type: String,
      required: [true, 'Id is required'],
    },
    recoveryCode: {
      type: String,
      required: [true, 'Id is required'],
    },
    createdAt: {
      type: String,
      required: [true, 'Id is required'],
    },
  });
