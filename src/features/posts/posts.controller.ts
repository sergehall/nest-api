import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ContentInputModelType,
  CreatePostInputModelType,
  DTOPost,
  QueryDTOType,
  UserType,
} from '../../types/types';
import { PostsService } from './posts.service';
import { ParseQuery } from '../../common/queries/parse-query';
import { CommentsService } from '../comments/comments.service';
@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected commentsService: CommentsService,
  ) {}

  @Get()
  async findAllPosts(@Query() query) {
    const currentUser: UserType | null = null;
    const allQuery = ParseQuery.getPaginationData(query);
    const pageNumber = allQuery.pageNumber;
    const pageSize = allQuery.pageSize;
    const sortBy = allQuery.sortBy;
    const sortDirection = allQuery.sortDirection;
    const dtoQuery: QueryDTOType = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    };
    return await this.postsService.findPosts(dtoQuery, currentUser);
  }

  @Post()
  async createPost(@Body() inputModel: CreatePostInputModelType) {
    //if not find blogger return 404
    const dtoPost: DTOPost = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: inputModel.blogId,
    };
    return await this.postsService.createPost(dtoPost);
  }

  @Post(':postId/comments')
  async createCommentByPostId(
    @Body() inputModel: ContentInputModelType,
    @Param('postId') postId: string,
  ) {
    const user: UserType = {
      accountData: {
        id: 'c2b18894-8747-402e-9974-45fa4c7b41a4',
        login: 'Bob',
        email: 'bob@gmail.com',
        passwordHash:
          '$2b$11$.c.q/grUpeeU.SQM.NnOseR1vm.uQpniujrppjuvW/DNnMQ06Lv1C',
        createdAt: '2022-12-04T10:41:52.374Z',
      },
      emailConfirmation: {
        confirmationCode: 'a35ec071-d9cc-4866-b881-a4bc7f3383e9',
        expirationDate: '2022-12-04T11:46:52.374Z',
        isConfirmed: false,
        sentEmail: [],
      },
      registrationData: { ip: '::1', userAgent: 'PostmanRuntime/7.29.2' },
    };
    return await this.commentsService.createCommentByPostId(
      postId,
      inputModel.content,
      user,
    );
  }
}
