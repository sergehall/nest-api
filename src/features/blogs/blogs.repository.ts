import { BlogsEntityType, EntityPaginationType } from '../../types/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel('blogs')
    private blogsModel: mongoose.Model<BlogsEntityType>,
  ) {}
  async getBlogs(
    entityFindBlogs: EntityPaginationType,
    filters: object[],
  ): Promise<BlogsEntityType[]> {
    return await this.blogsModel
      .find(
        { $and: filters },
        {
          _id: false,
          __v: false,
        },
      )
      .limit(entityFindBlogs.pageSize)
      .skip(entityFindBlogs.startIndex)
      .sort({ [entityFindBlogs.field]: entityFindBlogs.direction })
      .lean();
  }

  async findBlogById(id: string): Promise<BlogsEntityType | null> {
    return await this.blogsModel
      .findOne(
        { id: id },
        {
          _id: false,
          __v: false,
        },
      )
      .lean();
  }

  async updatedBlogById(
    id: string,
    newBlog: BlogsEntityType,
  ): Promise<boolean> {
    return await this.blogsModel
      .findOneAndUpdate(
        { id: id },
        {
          $set: {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
          },
        },
        { returnDocument: 'after', projection: { _id: false, __v: false } },
      )
      .lean();
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.blogsModel.deleteOne({ id: id });
    return result.acknowledged && result.deletedCount === 1;
  }

  async countDocuments([...filters]) {
    return await this.blogsModel.countDocuments({ $and: filters });
  }

  async createBlogs(newBlog: BlogsEntityType): Promise<boolean> {
    const result = await this.blogsModel.create(newBlog);
    return result.id !== null;
  }
}
