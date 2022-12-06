import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CommentsEntityType, CommentType } from '../../types/types';
@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel('comments')
    private commentsModel: mongoose.Model<CommentsEntityType>,
  ) {}

  async findCommentById(id: string): Promise<CommentType | null> {
    const result = await this.commentsModel
      .findOne(
        { 'allComments.id': id },
        {
          _id: false,
          'allComments._id': false,
          'allComments.likesInfo._id': false,
        },
      )
      .then((c) => c?.allComments.filter((i) => i.id === id)[0]);
    return result ? result : null;
  }

  async findCommentByPostId(postId: string): Promise<CommentType[] | null> {
    const result = await this.commentsModel.findOne(
      { postId: postId },
      {
        _id: false,
        'allComments._id': false,
        'allComments.likesInfo._id': false,
      },
    );

    return !result ? [] : result.allComments;
  }

  async createCommentByPostId(
    postId: string,
    newComment: CommentType,
  ): Promise<boolean> {
    const findPost = await this.commentsModel.findOne({ postId: postId });
    if (!findPost) {
      const create = await this.commentsModel.create({
        postId: postId,
        allComments: [newComment],
      });
      return create.postId !== null;
    }
    findPost.allComments.push(newComment);
    await findPost.save();
    return true;
  }
}
