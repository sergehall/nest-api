import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CommentType, UserType } from '../../types/types';
import * as uuid4 from 'uuid4';

@Injectable()
export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}
  async findCommentById(id: string): Promise<CommentType | null> {
    return await this.commentsRepository.findCommentById(id);
  }
  async createCommentByPostId(
    postId: string,
    content: string,
    user: UserType | null,
  ): Promise<boolean> {
    const newComment: CommentType = {
      id: uuid4().toString(),
      content: content,
      userId: user.accountData.id,
      userLogin: user.accountData.login,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
    return await this.commentsRepository.createCommentByPostId(
      postId,
      newComment,
    );
  }
}
