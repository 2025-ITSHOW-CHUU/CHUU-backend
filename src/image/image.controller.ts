// image.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('upload')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  async printImage(@Body('file') base64: string, @Res() res: Response) {
    const html = await this.imageService.getPrintableHtmlFromBase64(base64);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Post('email')
  @UseInterceptors(FileInterceptor('image'))
  async sendImageEmail(
    @UploadedFile() file: Express.Multer.File,
    @Body('email') email: string,
    @Body('type') type: string,
  ) {
    return this.imageService.sendImageEmail(email, file, type);
  }
}
