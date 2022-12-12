import { HttpException, Injectable } from '@nestjs/common';
import * as uuid4 from 'uuid4';
import { PostsRepository } from './posts.repository';
import {
  DTOPost,
  EntityPaginationType,
  Pagination,
  PostInputModelType,
  PostsType,
  QueryPaginationType,
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
    paginationData: QueryPaginationType,
    filters: object[],
    currentUser: UserType | null,
  ): Promise<Pagination> {
    const pageSize = paginationData.pageSize;
    const direction = paginationData.sortDirection;
    let field = 'createdAt';
    if (
      paginationData.sortBy === 'title' ||
      paginationData.sortBy === 'shortDescription' ||
      paginationData.sortBy === 'blogId' ||
      paginationData.sortBy === 'blogName' ||
      paginationData.sortBy === 'content'
    ) {
      field = paginationData.sortBy;
    }
    const startIndex =
      (paginationData.pageNumber - 1) * paginationData.pageSize;
    const entityFindPosts: EntityPaginationType = {
      startIndex: startIndex,
      pageSize: pageSize,
      field: field,
      direction: direction,
    };
    const posts = await this.postsRepository.findPosts(
      entityFindPosts,
      filters,
    );
    let filledPost = [];
    if (currentUser) {
      filledPost = await this.preparationPosts.preparationPostsForReturn(
        posts,
        currentUser,
      );
    }
    const totalCount = await this.postsRepository.countDocuments(filters);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount: pagesCount,
      page: paginationData.pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,
      items: filledPost.length === 0 ? posts : filledPost,
    };
  }

  async findPostById(id: string): Promise<PostsType | null> {
    return await this.postsRepository.findPostById(id);
  }

  async createPost(dtoPost: DTOPost): Promise<PostsType> {
    const newPost: PostsType = {
      id: uuid4().toString(),
      title: dtoPost.title,
      shortDescription: dtoPost.shortDescription,
      content: dtoPost.content,
      blogId: dtoPost.blogId,
      blogName: dtoPost.blogName,
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
  async updatePostById(
    id: string,
    updatePostDTO: PostInputModelType,
  ): Promise<boolean> {
    const findBlog = 'Niko';
    // const findBlog = await this.blogsRepository.findBlogById(newBlogId);
    // if (!findBlog) {
    //   errorsArray.push(notFoundBlogId);
    //   return {
    //     data: null,
    //     errorsMessages: errorsArray,
    //     resultCode: 1,
    //   };
    // }
    const newPost: PostsType = {
      id: id,
      title: updatePostDTO.title,
      shortDescription: updatePostDTO.shortDescription,
      content: updatePostDTO.content,
      blogId: updatePostDTO.blogId,
      blogName: findBlog,
      createdAt: new Date().toISOString(),
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    };
    return await this.postsRepository.updatePostById(newPost);
  }

  async deletePostById(id: string): Promise<boolean> {
    return await this.postsRepository.deletePostById(id);
  }
}
