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
  BlogInputModelType,
  CreatePostBlogInputModelType,
  DTOPost,
  QueryPaginationType,
  UserType,
} from '../../types/types';
import { ParseQuery } from '../../common/queries/parse-query';
import { PostsService } from '../posts/posts.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
  ) {}
  @Get()
  async getAllBlogs(@Query() query) {
    const paginationData = ParseQuery.getPaginationData(query);
    const searchFilters = { searchNameTerm: paginationData.searchNameTerm };
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    return await this.blogsService.getBlogs(dtoPagination, [searchFilters]);
  }
  @Post()
  async createNewBlog(@Body() inputModel: BlogInputModelType) {
    const blogDTO: BlogInputModelType = {
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    };
    return await this.blogsService.createBlogs(blogDTO);
  }
  @Get(':blogId/posts')
  async getPostsByBlogId(@Param('blogId') blogId: string, @Query() query) {
    const currentUser: UserType | null = null;
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    const filterBlogId = [{ blogId: blogId }];
    return await this.postsService.findPosts(
      dtoPagination,
      filterBlogId,
      currentUser,
    );
  }
  @Post(':blogId/posts')
  async createPostByBloggerId(
    @Param('blogId') blogId: string,
    @Body() inputModel: CreatePostBlogInputModelType,
  ) {
    // find blogger in DB if not exist return 404;
    const blogName = 'Volt';
    const dtoPost: DTOPost = {
      title: inputModel.title,
      shortDescription: inputModel.shortDescription,
      content: inputModel.content,
      blogId: blogId,
      blogName: blogName,
    };
    return await this.postsService.createPost(dtoPost);
  }
  @Get(':id')
  async findBlogById(@Param('id') blogId: string) {
    const blog = await this.blogsService.findBlogById(blogId);
    if (!blog) throw new HttpException('Not found', 404);
    return blog;
  }
  @Put(':id')
  async updateBlogById(
    @Param('id') id: string,
    @Body() inputModel: BlogInputModelType,
  ) {
    const updateBlogDTO: BlogInputModelType = {
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
