import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './features/users/users.controller';
import { UsersService } from './features/users/users.service';
import { EmailsRepository } from './features/emails/emails.repository';
import { UsersRepository } from './features/users/users.repository';
import { TestingController } from './features/testing  /testing.controller';
import { TestingService } from './features/testing  /testing.service';
import { TestingRepository } from './features/testing  /testing.repository';
import { PostsService } from './features/posts/posts.service';
import { PostsRepository } from './features/posts/posts.repository';
import { PreparationPosts } from './features/posts/preparationPosts/posts.preperation';
import { CommentsController } from './features/comments/comments.controller';
import { CommentsService } from './features/comments/comments.service';
import { CommentsRepository } from './features/comments/comments.repository';
import { BlogsController } from './features/blogs/blogs.controller';
import { PostsController } from './features/posts/posts.controller';
import { BlogsService } from './features/blogs/blogs.service';
import { BlogsRepository } from './features/blogs/blogs.repository';
import { PreparationComments } from './features/comments/preparationComments/comments.preperation';
import { modelsMongoose } from './infrastructure/schemes/modelsMongoose';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger/middleware';
import { ConvertFiltersForDB } from './common/queries/convertFiltersForDB';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.ATLAS_URI + '/' + process.env.NEST_DATABASE,
    ),
    MongooseModule.forFeature(modelsMongoose),
  ],
  controllers: [
    AppController,
    PostsController,
    UsersController,
    CommentsController,
    BlogsController,
    TestingController,
  ],
  providers: [
    UsersService,
    EmailsRepository,
    UsersRepository,
    TestingService,
    BlogsService,
    BlogsRepository,
    TestingRepository,
    PostsService,
    PostsRepository,
    PreparationPosts,
    PreparationComments,
    CommentsService,
    CommentsRepository,
    ConvertFiltersForDB,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'blogs', method: RequestMethod.GET }, 'blogs/(.*)')
      .forRoutes(BlogsController);
  }
}
