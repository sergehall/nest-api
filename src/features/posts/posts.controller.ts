import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CreatePostInputModelType,
  DTOPost,
  QueryDTOType,
  UserType,
} from '../../types/types';
import { PostsService } from './posts.service';
import { ParseQuery } from '../../common/queries/parse-query';
@Controller('posts')
export class PostsController {
  constructor(protected postsService: PostsService) {}
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
}
