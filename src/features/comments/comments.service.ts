import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import {
  CommentType,
  Pagination,
  QueryPaginationType,
  UserType,
} from '../../types/types';
import * as uuid4 from 'uuid4';
import { PreparationComments } from './preparationComments/comments.preperation';

@Injectable()
export class CommentsService {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected preparationComments: PreparationComments,
  ) {}

  async findCommentById(id: string): Promise<CommentType | null> {
    return await this.commentsRepository.findCommentById(id);
  }

  async findCommentsByPostId(
    dtoPagination: QueryPaginationType,
    postId: string,
    currentUser: UserType,
  ): Promise<Pagination> {
    const comments = await this.commentsRepository.findCommentByPostId(postId);
    if (comments.length === 0) {
      return {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      };
    }

    let desc = 1;
    let asc = -1;
    let field: 'userId' | 'userLogin' | 'content' | 'createdAt' = 'createdAt';
    if (
      dtoPagination.sortDirection === 'asc' ||
      dtoPagination.sortDirection === 'ascending' ||
      dtoPagination.sortDirection === 1
    ) {
      desc = -1;
      asc = 1;
    }
    if (
      dtoPagination.sortBy === 'userId' ||
      dtoPagination.sortBy === 'userLogin' ||
      dtoPagination.sortBy === 'content'
    ) {
      field = dtoPagination.sortBy;
    }
    const totalCount = comments.length ? comments.length : 0;
    const allComments = comments.sort(await byField(field, asc, desc));

    async function byField(
      field: 'userId' | 'userLogin' | 'content' | 'createdAt',
      asc: number,
      desc: number,
    ) {
      return (a: CommentType, b: CommentType) =>
        a[field] > b[field] ? asc : desc;
    }

    const startIndex = (dtoPagination.pageNumber - 1) * dtoPagination.pageSize;
    const pagesCount = Math.ceil(totalCount / dtoPagination.pageSize);

    const commentsSlice = allComments.slice(
      startIndex,
      startIndex + dtoPagination.pageSize,
    );
    const filledComments =
      await this.preparationComments.preparationCommentsForReturn(
        commentsSlice,
        currentUser,
      );
    return {
      pagesCount: pagesCount,
      page: dtoPagination.pageNumber,
      pageSize: dtoPagination.pageSize,
      totalCount: totalCount,
      items: filledComments,
    };
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
