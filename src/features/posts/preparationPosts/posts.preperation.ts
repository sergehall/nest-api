import { Injectable } from '@nestjs/common';
import {
  likeStatusPostsIdType,
  PostsType,
  UserType,
} from '../../../types/types';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class PreparationPosts {
  constructor(
    @InjectModel('likeStatusPosts')
    private likeStatusPosts: mongoose.Model<likeStatusPostsIdType>,
  ) {}
  async preparationPostsForReturn(
    postArray: PostsType[],
    currentUser: UserType | null,
  ): Promise<PostsType[]> {
    const filledPosts: PostsType[] = [];
    for (const i in postArray) {
      const postId = postArray[i].id;
      const currentPost: PostsType = postArray[i];

      // getting likes count
      const likesCount = await this.likeStatusPosts
        .countDocuments({
          $and: [{ postId: postId }, { likeStatus: 'Like' }],
        })
        .lean();

      // getting dislikes count
      const dislikesCount = await this.likeStatusPosts
        .countDocuments({
          $and: [{ postId: postId }, { likeStatus: 'Dislike' }],
        })
        .lean();

      // getting the status of the post owner
      let ownLikeStatus = 'None';
      if (currentUser) {
        const findOwnPost = await this.likeStatusPosts.findOne({
          $and: [{ postId: postId }, { userId: currentUser.accountData.id }],
        });
        if (findOwnPost) {
          ownLikeStatus = findOwnPost.likeStatus;
        }
      }

      // getting 3 last likes
      const newestLikes = await this.likeStatusPosts
        .find(
          {
            $and: [{ postId: postId }, { likeStatus: 'Like' }],
          },
          {
            _id: false,
            __v: false,
            postId: false,
            likeStatus: false,
            'extendedLikesInfo.newestLikes._id': false,
          },
        )
        .sort({ addedAt: -1 })
        .limit(3);

      const currentPostWithLastThreeLikes = {
        id: currentPost.id,
        title: currentPost.title,
        shortDescription: currentPost.shortDescription,
        content: currentPost.content,
        blogId: currentPost.blogId,
        blogName: currentPost.blogName,
        createdAt: currentPost.createdAt,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: ownLikeStatus,
          newestLikes: newestLikes,
        },
      };

      filledPosts.push(currentPostWithLastThreeLikes);
    }
    return filledPosts;
  }
}
