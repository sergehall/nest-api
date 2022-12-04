import { HttpException, Injectable } from '@nestjs/common';
import * as uuid4 from 'uuid4';
import { PostsRepository } from './posts.repository';
import {
  DTOPost,
  EntityQueryType,
  Pagination,
  PostsType,
  QueryDTOType,
  UserType,
} from '../../types/types';
import { PreparationPosts } from './preparationPosts/posts.preperation';

@Injectable()
export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected preparationPosts: PreparationPosts,
  ) {}
  async findPosts(
    dtoQuery: QueryDTOType,
    currentUser: UserType | null,
  ): Promise<Pagination> {
    const pageSize = dtoQuery.pageSize;
    const direction = dtoQuery.sortDirection;
    let field = 'createdAt';
    if (
      dtoQuery.sortBy === 'title' ||
      dtoQuery.sortBy === 'shortDescription' ||
      dtoQuery.sortBy === 'blogId' ||
      dtoQuery.sortBy === 'blogName' ||
      dtoQuery.sortBy === 'content' ||
      dtoQuery.sortBy === 'blogName'
    ) {
      field = dtoQuery.sortBy;
    }
    const startIndex = (dtoQuery.pageNumber - 1) * dtoQuery.pageSize;
    const entityFindPosts: EntityQueryType = {
      startIndex: startIndex,
      pageSize: pageSize,
      field: field,
      direction: direction,
    };
    const posts = await this.postsRepository.findPosts(entityFindPosts, [{}]);
    let filledPost = [];
    if (currentUser) {
      filledPost = await this.preparationPosts.preparationPostsForReturn(
        posts,
        currentUser,
      );
    }
    const totalCount = await this.postsRepository.countDocuments([{}]);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: dtoQuery.pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledPost.length === 0 ? posts : filledPost,
    };
  }
  async createPost(dtoPost: DTOPost): Promise<PostsType> {
    const newPost: PostsType = {
      id: uuid4().toString(),
      title: dtoPost.title,
      shortDescription: dtoPost.shortDescription,
      content: dtoPost.content,
      blogId: dtoPost.blogId,
      blogName: dtoPost.blogId,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };

    const result = await this.postsRepository.createPost(newPost);
    if (!result) {
      throw new HttpException('Not create post', 500);
    }
    return newPost;
  }
}
