import {
  Body,
  Controller,
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
  DTOQuery,
  SortOrder,
} from '../../types/types';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  async getUsers(@Query() query) {
    const allQuery = ParseQuery.getPaginationData(query);
    const pageNumber: number = allQuery.pageNumber;
    const pageSize: number = allQuery.pageSize;
    const searchLoginTerm: string | null = allQuery.searchLoginTerm;
    const searchEmailTerm: string | null = allQuery.searchEmailTerm;
    const sortBy: string | null = allQuery.sortBy;
    const sortDirection: SortOrder = allQuery.sortDirection;
    const dtoQuery: DTOQuery = {
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
    return await this.usersService.createUser(dtoNewUser);
  }
}
