import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './features/users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogsSchema,
  EmailsRecoveryCodeSchema,
  EmailsToSentSchema,
  LikeStatusPostsIdSchema,
  PostsSchema,
  UserSchema,
} from './infrastructure/schemes/schemes';
import { UsersService } from './features/users/users.service';
import { EmailsRepository } from './features/emails/emails.repository';
import { UsersRepository } from './features/users/users.repository';
import { DatabaseModule } from './infrastructure/conection/db.module';
import { TestingController } from './features/testing  /testing.controller';
import { TestingService } from './features/testing  /testing.service';
import { TestingRepository } from './features/testing  /testing.repository';
import { BlogsController } from './features/blogs/blogs.controller';
import { BlogsService } from './features/blogs/blogs.service';
import { BlogsRepository } from './features/blogs/blogs.repository';
import { PostsController } from './features/posts/posts.controller';
import { PostsService } from './features/posts/posts.service';
import { PostsRepository } from './features/posts/posts.repository';
import { PreparationPosts } from './features/posts/preparationPosts/posts.preperation';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema, collection: 'Users' },
      { name: 'blogs', schema: BlogsSchema, collection: 'Blogs' },
      { name: 'posts', schema: PostsSchema, collection: 'Posts' },
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
    ]),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    UsersController,
    TestingController,
  ],
  providers: [
    UsersService,
    EmailsRepository,
    UsersRepository,
    TestingService,
    TestingRepository,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    PreparationPosts,
  ],
})
export class AppModule {}
