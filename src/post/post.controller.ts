import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/post.dto';
import * as multer from 'multer';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor({ storage: multer.memoryStorage() }))
  async uploadPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.uploadPost(createPostDto, files);
  }

  @Get()
  async getPost() {
    return await this.postService.getPost();
  }

  @Get('/num')
  async getTotalPostsNum() {
    return await this.postService.getTotalPostsNum();
  }
}
