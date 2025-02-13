import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post('vote')
  async saveScore(
    @Body('questionNumber') questionNumber: number,
    @Body('teacherName') teacherName: string,
  ) {
    return this.homeService.saveScore(questionNumber, teacherName);
  }

  @Get('get/:questionNumber')
  async getScores(@Param('questionNumber') questionNumber: number) {
    return this.homeService.getScore(questionNumber);
  }
}
