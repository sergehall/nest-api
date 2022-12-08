import {
  BlogsEntityType,
  EntityPaginationType,
  SearchFiltersType,
} from '../../types/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateFiltersForDB } from '../../common/queries/pretFiltersToDB';

@Injectable()
export class BlogsRepository {
  constructor(
    protected creatFiltersForDB: CreateFiltersForDB,
    @InjectModel('blogs')
    private blogsModel: mongoose.Model<BlogsEntityType>,
  ) {}
  async getBlogs(
    entityFindBlogs: EntityPaginationType,
    filters: SearchFiltersType,
  ): Promise<BlogsEntityType[]> {
    const convertedForDBFilters = await this.creatFiltersForDB.prep(filters);
    return await this.blogsModel
      .find(
        { $and: convertedForDBFilters },
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
    const convertedForDBFilters = await this.creatFiltersForDB.prep(filters);
    return await this.blogsModel.countDocuments({
      $and: convertedForDBFilters,
    });
  }

  async createBlogs(newBlog: BlogsEntityType): Promise<boolean> {
    const result = await this.blogsModel.create(newBlog);
    return result.id !== null;
  }
}
