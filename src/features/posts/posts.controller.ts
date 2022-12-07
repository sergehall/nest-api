import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ContentInputModelType,
  DTOPost,
  PostInputModelType,
  QueryPaginationType,
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

  @Get(':postId/comments')
  async getCommentsByPostId(@Query() query, @Param('postId') postId: string) {
    const currentUser: UserType | null = null;
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return await this.commentsService.findCommentsByPostId(
      dtoPagination,
      postId,
      currentUser,
    );
  }

  @Get()
  async getAllPosts(@Query() query) {
    const currentUser: UserType | null = null;
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return await this.postsService.findPosts(dtoPagination, [{}], currentUser);
  }
  @Get(':id')
  async findPostById(@Param('id') id: string) {
    const post = await this.postsService.findPostById(id);
    if (!post) throw new HttpException('Not found', 404);
    return post;
  }

  @Post()
  async createPost(@Body() inputModel: PostInputModelType) {
    //if not find blogger return 404. take Name in  @UseGuards()
    const blogName = 'Volt';
    const dtoPost: DTOPost = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: inputModel.blogId,
      blogName: blogName,
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
  @Put(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() inputModel: PostInputModelType,
  ) {
    const updatePostDTO: PostInputModelType = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: inputModel.blogId,
    };
    const updatePost = await this.postsService.updatePostById(
      id,
      updatePostDTO,
    );
    if (!updatePost) throw new HttpException('Not found', 404);
    return updatePost;
  }
  @Delete(':id')
  async deletePostById(@Param('id') id: string) {
    const deletedPost = await this.postsService.deletePostById(id);
    if (!deletedPost) throw new HttpException('Not found', 404);
    return deletedPost;
  }
}
