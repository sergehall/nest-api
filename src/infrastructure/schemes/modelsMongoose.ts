import {
  BlogsSchema,
  CommentsSchema,
  EmailsRecoveryCodeSchema,
  EmailsToSentSchema,
  LikeStatusPostsIdSchema,
  PostsSchema,
  UserSchema,
} from './schemes';

export const mongooseModels = [
  { name: 'users', schema: UserSchema, collection: 'Users' },
  { name: 'blogs', schema: BlogsSchema, collection: 'Blogs' },
  { name: 'posts', schema: PostsSchema, collection: 'Posts' },
  { name: 'comments', schema: CommentsSchema, collection: 'Comments' },
  {
    name: 'MyModelEmailsConfirmCode',
    schema: EmailsToSentSchema,
    collection: 'EmailsConfirmationCode',
  },
  {
    name: 'MyModelEmailsRecoveryCode',
    schema: EmailsRecoveryCodeSchema,
    collection: 'EmailsRecoveryCode',
  },
  {
    name: 'likeStatusPosts',
    schema: LikeStatusPostsIdSchema,
    collection: 'LikeStatusPosts',
  },
];
