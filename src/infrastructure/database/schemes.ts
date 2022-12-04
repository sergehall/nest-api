import mongoose from 'mongoose';
import {
  BlogsEntityType,
  EmailConfirmCodeType,
  EmailRecoveryCodeType,
  likeStatusPostsIdType,
  UserType,
} from '../../types/types';

export const BlogsSchema = new mongoose.Schema<BlogsEntityType>({
  id: {
    type: String,
    required: [true, 'id is required'],
  },
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  description: {
    type: String,
    required: [true, 'description is required'],
  },
  websiteUrl: {
    type: String,
    required: [true, 'websiteUrl is required'],
  },
  createdAt: {
    type: String,
    required: [true, 'createdAt is required'],
  },
});

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

export const PostsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Id is required!!!'],
  },
  title: {
    type: String,
    required: [true, 'title is required'],
  },
  shortDescription: {
    type: String,
    required: [true, 'shortDescription is required'],
  },
  content: {
    type: String,
    required: [true, 'content is required'],
  },
  blogId: {
    type: String,
    required: [true, 'blogId is required'],
  },
  blogName: {
    type: String,
    required: [true, 'blogName is required'],
  },
  createdAt: {
    type: String,
    required: [true, 'addedAt is required'],
  },
  extendedLikesInfo: {
    likesCount: {
      type: Number,
      required: [true, 'likesCount is required'],
    },
    dislikesCount: {
      type: Number,
      required: [true, 'dislikesCount is required'],
    },
    myStatus: {
      type: String,
      required: [true, 'myStatus is required'],
    },
    newestLikes: {
      type: Array({
        addedAt: {
          type: String,
          required: [true, 'addedAt is required'],
        },
        userId: {
          type: String,
          required: [true, 'userId is required'],
        },
        login: {
          type: String,
          required: [true, 'login is required'],
        },
      }),
      validate: (v: any) => Array.isArray(v),
    },
  },
});

export const LikeStatusPostsIdSchema =
  new mongoose.Schema<likeStatusPostsIdType>({
    postId: {
      type: String,
      required: [true, 'postId is required'],
    },
    userId: {
      type: String,
      required: [true, 'userId is required'],
    },
    login: {
      type: String,
      required: [true, 'login is required'],
    },
    likeStatus: {
      type: String,
      enum: ['Like', 'Dislike', 'None'],
      required: [true, 'likeStatus is required'],
    },
    addedAt: {
      type: String,
      required: [true, 'addedAt is required'],
    },
  });
