import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  getUsers(@Query() query) {
    return [{ id: 1 }, { id: 2 }];
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
