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
  QueryDTOType,
} from '../../types/types';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query) {
    const allQuery = ParseQuery.getPaginationData(query);
    const pageNumber = allQuery.pageNumber;
    const pageSize = allQuery.pageSize;
    const searchLoginTerm = allQuery.searchLoginTerm;
    const searchEmailTerm = allQuery.searchEmailTerm;
    const sortBy = allQuery.sortBy;
    const sortDirection = allQuery.sortDirection;
    const dtoQuery: QueryDTOType = {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm,
    };
    const users = await this.usersService.findUsers(dtoQuery);
    if (!users) throw new HttpException('Not found', 404);
    return users;
  }

  @Get(':id')
  async getUsersById(@Param('id') userId: string) {
    return [{ id: 1 }, { id: 2 }].find((i) => i.id === +userId);
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
