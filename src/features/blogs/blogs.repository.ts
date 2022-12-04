import { BlogsEntityType } from '../../types/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel('blogs') private blogsModel: mongoose.Model<BlogsEntityType>,
  ) {}
  async createBlogs(newBlog: BlogsEntityType): Promise<boolean> {
    const result = await this.blogsModel.create(newBlog);
    return result.id !== null;
  }
}
