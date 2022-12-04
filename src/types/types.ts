import { ObjectId } from 'mongodb';
export type SortOrder = -1 | 1 | 'descending' | 'desc' | 'ascending' | 'asc';
//...............................................Errors
export type ErrorType = {
  message: string;
  field: string;
};
export type ArrayErrorsType = ErrorType[];
//...............................................Pagination Query
export type Pagination = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostsType[] | CommentType[] | BlogsType[] | UserType[];
};
export type QueryDTOType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortOrder;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  searchNameTerm?: string;
};
export type EntityQueryType = {
  startIndex: number;
  pageSize: number;
  field: string;
  direction: SortOrder;
  filterLogin?: string;
  filterEmail?: string;
};
export const sortDirectArr = [-1, 1, 'descending', 'desc', 'ascending', 'asc'];
//...............................................User
export type CreateUserInputModelType = {
  login: string;
  password: string;
  email: string;
};
export type UserType = {
  accountData: {
    id: string;
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
    sentEmail: string[];
  };
  registrationData: {
    ip: string | null;
    userAgent: string;
  };
};
export type UserTestOldType = {
  id: string;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};
export type UserTestType = {
  _id: ObjectId;
  accountData: {
    id: string;
    login: string;
    email: string;
    passwordHash: string;
  };
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: string;
    isConfirmed: boolean;
    sentEmail: string[];
  };
  registrationData: {
    ip: string | null;
    userAgent: string;
    createdAt: string;
  };
};
export type DTONewUser = {
  login: string;
  password: string;
  email: string;
  userAgent: string;
  clientIp: string;
};
//...............................................Blogs
export type BlogsType = {
  id: string;
  name: string;
  websiteUrl: string;
  createdAt: string;
};
export type ReturnObjBlogType = {
  data: BlogsType | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
export type DTOBlogsType = {
  pageSize: number;
  startIndex: number;
  field: string;
  direction: SortOrder;
};
export type CreateBlogInputModelType = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type BlogsDTOType = {
  name: string;
  description: string;
  websiteUrl: string;
};
export type BlogsEntityType = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
};
//...............................................Posts
export type PostsType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
};
export type ReturnObjPostType = {
  data: PostsType | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
export type DTOPosts = {
  pageSize: number;
  startIndex: number;
  field: string;
  direction: SortOrder;
};
export type DTOFindPostsByBlogId = {
  blogId: string;
  pageSize: number;
  startIndex: number;
  field: string;
  direction: SortOrder;
};
//...............................................Comments
export type CommentType = {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export type CommentsTypeModel = {
  postId: string;
  allComments: CommentType[];
};
export type ReturnObjCommentType = {
  data: CommentType | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
//...............................................Emails
export type EmailConfirmCodeType = {
  email: string;
  confirmationCode: string;
  createdAt: string;
};
export type EmailRecoveryCodeType = {
  email: string;
  recoveryCode: string;
  createdAt: string;
};
//...............................................Last10secReq
export type Last10secReq = {
  ip: string;
  createdAt: string;
};

//...............................................Feedbacks
export type Feedback = {
  commentId: string;
  comment: string;
};
export type FeedbacksTypeModel = {
  id: string;
  allFeedbacks: Feedback[];
};
export type ReturnTypeObjectFeedback = {
  data: Feedback[] | null;
  errorsMessages: ErrorType[];
  resultCode: number;
};
//...............................................Devices
export type DevicesSchemaModel = {
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: string;
  expirationDate: string;
  deviceId: string;
};
//...............................................BlackList
export type BlackListRefreshTokenJWT = {
  refreshToken: string;
  expirationDate: string;
};
export type BlackListIPDBType = {
  ip: string;
  addedAt: string;
};
//...............................................likeStatus
export type likeStatusCommentIdType = {
  commentId: string;
  userId: string;
  likeStatus: string;
  createdAt: string;
};
export type likeStatusPostsIdType = {
  postId: string;
  userId: string;
  login: string;
  likeStatus: string;
  addedAt: string;
};
export type DTOLikeStatusComm = {
  commentId: string;
  userId: string;
  likeStatus: string;
  createdAt: string;
};
export type DTOLikeStatusPost = {
  postId: string;
  userId: string;
  login: string;
  likeStatus: string;
  addedAt: string;
};
//...............................................Session
export type SessionTypeArray = {
  ip: string | null;
  title: string | undefined;
  lastActiveDate: string;
  deviceId: string;
}[];
export type SessionDevicesType = {
  userId: string;
  ip: string | null;
  title: string;
  lastActiveDate: string;
  expirationDate: string;
  deviceId: string;
};
export type FilterUpdateDevicesType = {
  userId: string;
  deviceId: string;
};
//...............................................JWT Payload
export type PayloadType = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};
export type DTOJWT = {
  refreshToken: string;
  expirationDate: string;
};
export type Query = {
  pageNumber: number;
  pageSize: number;
  searchNameTerm: string;
  title: string;
  userName: string;
  searchTitle: string;
  code: string;
  confirmationCode: string;
  sortBy: -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';
  sortDirection: string;
  searchLoginTerm: string;
  searchEmailTerm: string;
};
