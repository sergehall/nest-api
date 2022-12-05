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
        },
      )
      .then((c) => c?.allComments.filter((i) => i.id === id)[0]);
    return result ? result : null;
  }
  async createCommentByPostId(
    postId: string,
    newComment: CommentType,
  ): Promise<boolean> {
    // console.log(postId, newComment, 'newComment --------------------');
    // const result = this.commentsModel.findOneAndUpdate(
    //   { postId: postId },
    //   {
    //     $push: { allComments: newComment },
    //   },
    //   { upsert: true, returnNewDocument: true },
    // );
    const findPost = await this.commentsModel.findOne({ postId: postId });
    if (!findPost) {
      const create = await this.commentsModel.create({
        postId: postId,
        allComments: [newComment],
      });
    } else {
      this.commentsModel.findOneAndUpdate(
        { postId: postId },
        {
          $push: { allComments: newComment },
        },
      );
    }
    const findPost2 = await this.commentsModel.findOne({ postId: postId });
    console.log(findPost2, 'findPost2 ++++++++++++++++++++++++');
    return findPost2 !== null;
  }
}
