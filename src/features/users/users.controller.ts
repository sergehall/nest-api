import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Ip,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ParseQuery } from '../../common/queries/parse-query';
import { UsersService } from './users.service';
import {
  CreateUserInputModelType,
  DTONewUser,
  QueryPaginationType,
} from '../../types/types';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query) {
    const paginationData = ParseQuery.getPaginationData(query);
    const dtoPagination: QueryPaginationType = {
      pageNumber: paginationData.pageNumber,
      pageSize: paginationData.pageSize,
      sortBy: paginationData.sortBy,
      sortDirection: paginationData.sortDirection,
    };
    const searchFilters = [
      {
        searchLoginTerm: paginationData.searchLoginTerm,
        searchEmailTerm: paginationData.searchEmailTerm,
      },
    ];

    const users = await this.usersService.findUsers(
      dtoPagination,
      searchFilters,
    );
    if (!users) throw new HttpException('Not found', 404);
    return users;
  }

  @Post()
  async createUsers(
    @Body() inputModel: CreateUserInputModelType,
    @Req() req: Request,
    @Ip() ip,
  ) {
    const userAgent = req.headers['user-agent']
      ? `${req.headers['user-agent']}`
      : '';
    const dtoNewUser: DTONewUser = {
      login: inputModel.login,
      password: inputModel.password,
      email: inputModel.email,
      userAgent: userAgent,
      clientIp: ip,
    };
    const newUser = await this.usersService.createUser(dtoNewUser);
    if (!newUser) throw new HttpException('Bad request', 400);
    return {
      id: newUser.accountData.id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    const deletedPost = await this.usersService.deleteUserById(id);
    if (!deletedPost) throw new HttpException('Not found', 404);
    return deletedPost;
  }
}
