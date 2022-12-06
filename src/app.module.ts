import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from './features/users/users.controller';
import { UsersService } from './features/users/users.service';
import { EmailsRepository } from './features/emails/emails.repository';
import { UsersRepository } from './features/users/users.repository';
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
import { CommentsController } from './features/comments/comments.controller';
import { CommentsService } from './features/comments/comments.service';
import { CommentsRepository } from './features/comments/comments.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModels } from './infrastructure/schemes/modelsMongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.ATLAS_URI + '/' + process.env.NEST_DATABASE,
    ),
    MongooseModule.forFeature(mongooseModels),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
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
    CommentsService,
    CommentsRepository,
  ],
})
export class AppModule {}
