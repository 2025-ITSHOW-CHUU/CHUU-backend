import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/upload')
  async uploadImage(@Body() body: { image: string }) {
    const filename = await this.imageService.saveBase64Image(body.image);
    return { filename };
  }

  @Get('/print/:filename')
  async printPage(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const html = await this.imageService.getPrintableHtml(filename);
      res.send(html);
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND, error);
    }
  }
}
