import { BlogsService } from './blogs.service';
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
  BlogsDTOType,
  CreateBlogInputModelType,
  QueryDTOType,
} from '../../types/types';
import { ParseQuery } from '../../common/queries/parse-query';
@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @Get()
  async findAllBlogs(@Query() query) {
    const allQuery = ParseQuery.getPaginationData(query);
    const searchNameTerm = allQuery.searchNameTerm;
    const pageNumber = allQuery.pageNumber;
    const pageSize = allQuery.pageSize;
    const sortBy = allQuery.sortBy;
    const sortDirection = allQuery.sortDirection;
    const dtoQuery: QueryDTOType = {
      searchNameTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    };
    return await this.blogsService.findBlogs(dtoQuery);
  }
  @Get(':id')
  async findBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) throw new HttpException('Not found', 404);
    return blog;
  }
  @Post()
  async createNewBlog(@Body() inputModel: CreateBlogInputModelType) {
    const blogDTO: BlogsDTOType = {
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    };
    return await this.blogsService.createBlogs(blogDTO);
  }
  @Put(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() inputModel: CreateBlogInputModelType,
  ) {
    const updateBlogDTO: BlogsDTOType = {
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    };
    const blog = await this.blogsService.updateBlogById(id, updateBlogDTO);
    if (!blog) throw new HttpException('Not found', 404);
    return blog;
  }
  @Delete(':id')
  async deleteBlogById(@Param('id') id: string) {
    const deletedPost = await this.blogsService.deleteBlogById(id);
    if (!deletedPost) throw new HttpException('Not found', 404);
    return deletedPost;
  }
}
