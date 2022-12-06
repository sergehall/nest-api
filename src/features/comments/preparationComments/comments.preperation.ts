import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentType,
  LikeStatusCommentIdType,
  UserType,
} from '../../../types/types';

@Injectable()
export class PreparationComments {
  constructor(
    @InjectModel('likeStatusPosts')
    private likeStatusComment: mongoose.Model<LikeStatusCommentIdType>,
  ) {}
  async preparationCommentsForReturn(
    commentsArray: CommentType[],
    currentUser: UserType | null,
  ) {
    const filledComments = [];
    for (const i in commentsArray) {
      const commentId = commentsArray[i].id;
      const currentComment: CommentType = commentsArray[i];

      let ownLikeStatus = 'None';
      if (currentUser) {
        const currentComment = await this.likeStatusComment.findOne(
          {
            $and: [
              { userId: currentUser.accountData.id },
              { commentId: commentId },
            ],
          },
          {
            _id: false,
            __v: false,
          },
        );
        if (currentComment) {
          ownLikeStatus = currentComment.likeStatus;
        }
      }

      // getting likes count
      const likesCount = await this.likeStatusComment.countDocuments({
        $and: [{ commentId: commentId }, { likeStatus: 'Like' }],
      });

      // getting dislikes count
      const dislikesCount = await this.likeStatusComment.countDocuments({
        $and: [{ commentId: commentId }, { likeStatus: 'Dislike' }],
      });

      const filledComment: CommentType = {
        id: currentComment.id,
        content: currentComment.content,
        userId: currentComment.userId,
        userLogin: currentComment.userLogin,
        createdAt: currentComment.createdAt,
        likesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: ownLikeStatus,
        },
      };
      filledComments.push(filledComment);
    }
    return filledComments;
  }
}
