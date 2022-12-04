import { BlogsRepository } from './blogs.repository';
import { BlogsDTOType, BlogsEntityType } from '../../types/types';
import * as uuid4 from 'uuid4';
import { Injectable } from '@nestjs/common';
@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
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
}
