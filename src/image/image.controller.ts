// image.controller.ts
import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
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

  // //EMAIL_USER=jieyn7@naver.com
  // EMAIL_PASS=네이버_앱_비밀번호
  @Post('email')
  async sendImageEmail(
    @Body() body: { email: string; image: string },
  ): Promise<string> {
    const { email, image } = body;
    await this.imageService.sendImageEmail(email, image);
    return '이메일 전송 완료!';
  }
}
