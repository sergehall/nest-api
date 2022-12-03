import { Injectable } from '@nestjs/common';
import { sortDirectArr, SortOrder } from '../../types/types';

@Injectable()
export class ParseQuery {
  static getPaginationData(query) {
    let pageNumber: number = parseInt(<string>query.pageNumber);
    let pageSize: number = parseInt(<string>query.pageSize);
    let searchNameTerm: string | undefined | null =
      query.searchNameTerm?.toString();
    let searchLoginTerm: string | undefined | null =
      query.searchLoginTerm?.toString();
    let searchEmailTerm: string | undefined | null =
      query.searchEmailTerm?.toString();
    let title: string | undefined | null = query.sitle?.toString();
    let userName: string | undefined | null = query.searchName?.toString();
    let searchTitle: string | undefined | null = query.searchTitle?.toString();
    let code: string | undefined | null = query.sode?.toString();
    let confirmationCode: string | undefined | null =
      query.sonfirmationCode?.toString();
    let sortBy: string | undefined | null = query.sortBy?.toString();
    let sortDirection: SortOrder = query.sortDirection;

    if (!searchNameTerm || searchNameTerm.length === 0) {
      searchNameTerm = null;
    }
    if (!searchLoginTerm || searchLoginTerm.length === 0) {
      searchLoginTerm = null;
    }
    if (!searchEmailTerm || searchEmailTerm.length === 0) {
      searchEmailTerm = null;
    }
    if (!confirmationCode || confirmationCode.length === 0) {
      confirmationCode = null;
    }
    if (!code || code.length === 0) {
      code = null;
    }
    if (!searchTitle || searchTitle.length === 0) {
      searchTitle = null;
    }
    if (!title || title.length === 0) {
      title = null;
    }
    if (!userName || userName.length === 0) {
      userName = null;
    }
    if (isNaN(pageNumber)) {
      pageNumber = 1;
    }
    if (isNaN(pageSize)) {
      pageSize = 10;
    }
    if (!sortBy || sortBy.length === 0) {
      sortBy = null;
    }
    if (!sortDirection || !sortDirectArr.includes(sortDirection)) {
      sortDirection = -1;
    }
    return {
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchNameTerm: searchNameTerm,
      title: title,
      userName: userName,
      searchTitle: searchTitle,
      code: code,
      confirmationCode: confirmationCode,
      sortBy: sortBy,
      sortDirection: sortDirection,
      searchLoginTerm: searchLoginTerm,
      searchEmailTerm: searchEmailTerm,
    };
  }
}
