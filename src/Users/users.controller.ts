import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ParseQuery } from '../guards/middleware/parse-query';
import { UsersService } from './users.service';
import { DTOQuery, SortOrder } from '../types/types';

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
  getUsersById(@Param('id') userId: string) {
    return [{ id: 1 }, { id: 2 }].find((i) => i.id === +userId);
  }
  @Post()
  createUsers(@Body() inputModel: CreateUserInputModelType) {
    return [
      {
        id: 12,
        name: inputModel.name,
        childrenCount: inputModel.childrenCount,
      },
    ];
  }
}

type CreateUserInputModelType = {
  name: string;
  childrenCount: number;
};
