import { BlogsRepository } from './blogs.repository';
import {
  BlogsDTOType,
  BlogsEntityType,
  BlogsType,
  EntityQueryType,
  Pagination,
  QueryDTOType,
} from '../../types/types';
import * as uuid4 from 'uuid4';
import { Injectable } from '@nestjs/common';
@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async findBlogs(dtoQuery: QueryDTOType): Promise<Pagination> {
    const pageNumber = dtoQuery.pageNumber;
    const startIndex = (dtoQuery.pageNumber - 1) * dtoQuery.pageSize;
    const pageSize = dtoQuery.pageSize;
    let field = 'createdAt';
    if (dtoQuery.sortBy === 'name' || dtoQuery.sortBy === 'websiteUrl') {
      field = dtoQuery.sortBy;
    }
    const direction = dtoQuery.sortDirection;
    const entityFindBlogs: EntityQueryType = {
      startIndex,
      pageSize,
      field,
      direction,
    };
    const blogs = await this.blogsRepository.findBlogs(entityFindBlogs);
    const totalCount = await this.blogsRepository.countDocuments([{}]);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: blogs,
    };
  }

  async findBlogById(id: string): Promise<BlogsType | null> {
    return await this.blogsRepository.findBlogById(id);
  }

  async createBlogs(blogDTO: BlogsDTOType): Promise<boolean> {
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
    updateBlogDTO: BlogsDTOType,
  ): Promise<boolean> {
    const newBlog: BlogsType = {
      id: id,
      name: updateBlogDTO.name,
      websiteUrl: updateBlogDTO.websiteUrl,
      createdAt: new Date().toISOString(),
    };
    return await this.blogsRepository.updatedBlogById(id, newBlog);
  }

  async deleteBlogById(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteUserById(id);
  }
}
