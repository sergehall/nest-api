import { BlogsService } from './blogs.service';
import { Body, Controller, Post } from '@nestjs/common';
import { BlogsDTOType, CreateBlogInputModelType } from '../../types/types';
@Controller('blogs')
export class BlogsController {
  constructor(protected blogsService: BlogsService) {}
  @Post()
  async createNewBlog(@Body() inputModel: CreateBlogInputModelType) {
    const blogDTO: BlogsDTOType = {
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    };
    return await this.blogsService.createBlogs(blogDTO);
    // try {
    //   const name = req.body.name;
    //   const websiteUrl = req.body.websiteUrl
    //
    //   const newBlog = await this.blogsService.createBlog(name, websiteUrl);
    //   if (newBlog.data && newBlog.data.name) {
    //     res.status(201)
    //     res.send({
    //         id: newBlog.data.id,
    //         name: newBlog.data.name,
    //         websiteUrl: newBlog.data.websiteUrl,
    //         createdAt: newBlog.data.createdAt
    //       }
    //     )
    //   }
    //
    // } catch (error) {
    //   return res.sendStatus(500)
    // }
  }
}
