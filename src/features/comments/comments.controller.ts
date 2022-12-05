import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(protected commentsService: CommentsService) {}
  @Get(':id')
  async findCommentById(@Param('id') blogId: string) {
    const comment = await this.commentsService.findCommentById(blogId);
    if (!comment) throw new HttpException('Not found', 404);
    return comment;
  }
}
