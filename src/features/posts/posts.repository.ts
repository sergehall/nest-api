import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EntityPaginationType, PostsType } from '../../types/types';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel('posts') private postsModel: mongoose.Model<PostsType>,
  ) {}
  async findPosts(
    entityFindPosts: EntityPaginationType,
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

  async findPostById(id: string): Promise<PostsType | null> {
    return await this.postsModel
      .findOne(
        { id: id },
        {
          _id: false,
          __v: false,
          'extendedLikesInfo.newestLikes_id': false,
        },
      )
      .lean();
  }

  async createPost(newPost: PostsType): Promise<PostsType> {
    return await this.postsModel.create(newPost);
  }
  async countDocuments([...filters]) {
    return await this.postsModel.countDocuments({ $and: filters });
  }
}
