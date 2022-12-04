import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EntityQueryType, PostsType } from '../../types/types';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel('posts') private postsModel: mongoose.Model<PostsType>,
  ) {}

  async findPosts(
    entityFindPosts: EntityQueryType,
    [...filters],
  ): Promise<PostsType[]> {
    return await this.postsModel
      .find(
        { $and: filters },
        {
          _id: false,
          __v: false,
        },
      )
      .limit(entityFindPosts.pageSize)
      .skip(entityFindPosts.startIndex)
      .sort({ [entityFindPosts.field]: entityFindPosts.direction })
      .lean();
  }

  async createPost(newPost: PostsType): Promise<PostsType> {
    return await this.postsModel.create(newPost);
  }
  async countDocuments([...filters]) {
    return await this.postsModel.countDocuments({ $and: filters });
  }
}
