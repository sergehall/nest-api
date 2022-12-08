import { BlogsRepository } from './blogs.repository';
import {
  BlogInputModelType,
  BlogsEntityType,
  EntityPaginationType,
  Pagination,
  QueryPaginationType,
  SearchFiltersType,
} from '../../types/types';
import * as uuid4 from 'uuid4';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async getBlogs(
    dtoPagination: QueryPaginationType,
    searchFilters: SearchFiltersType,
  ): Promise<Pagination> {
    const pageNumber = dtoPagination.pageNumber;
    const startIndex = (dtoPagination.pageNumber - 1) * dtoPagination.pageSize;
    const pageSize = dtoPagination.pageSize;
    let field = 'createdAt';
    if (
      dtoPagination.sortBy === 'name' ||
      dtoPagination.sortBy === 'websiteUrl' ||
      dtoPagination.sortBy === 'description'
    ) {
      field = dtoPagination.sortBy;
    }
    const direction = dtoPagination.sortDirection;
    const entityPagination: EntityPaginationType = {
      startIndex,
      pageSize,
      field,
      direction,
    };
    const blogs = await this.blogsRepository.getBlogs(
      entityPagination,
      searchFilters,
    );
    const totalCount = await this.blogsRepository.countDocuments(searchFilters);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs,
    };
  }

  async findBlogById(id: string): Promise<BlogsEntityType | null> {
    return await this.blogsRepository.findBlogById(id);
  }

  async createBlogs(blogDTO: BlogInputModelType): Promise<boolean> {
    const id = uuid4().toString();
    const createdAt = new Date().toISOString();
    const newBlog: BlogsEntityType = {
      id: id,
      name: blogDTO.name,
      description: blogDTO.description,
      websiteUrl: blogDTO.websiteUrl,
      createdAt: createdAt,
    };
    return await this.blogsRepository.createBlogs(newBlog);
  }
  async updateBlogById(
    id: string,
    updateBlogDTO: BlogInputModelType,
  ): Promise<boolean> {
    const newBlog: BlogsEntityType = {
      id: id,
      name: updateBlogDTO.name,
      description: updateBlogDTO.description,
      websiteUrl: updateBlogDTO.websiteUrl,
      createdAt: new Date().toISOString(),
    };
    return await this.blogsRepository.updatedBlogById(id, newBlog);
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteUserById(id);
  }
}
