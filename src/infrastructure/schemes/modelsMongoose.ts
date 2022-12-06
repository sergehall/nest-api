import {
  BlogsSchema,
  CommentsSchema,
  EmailsRecoveryCodeSchema,
  EmailsToSentSchema,
  LikeStatusCommentSchema,
  LikeStatusPostsIdSchema,
  PostsSchema,
  UserSchema,
} from './schemes';

export const modelsMongoose = [
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
  {
    name: 'likeStatusComment',
    schema: LikeStatusCommentSchema,
    collection: 'LikeStatusComment',
  },
];
