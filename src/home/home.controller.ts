import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Post('')
  async saveScore(
    @Body('questionNumber') questionNumber: number,
    @Body('teacherName') teacherName: string,
  ) {
    return this.homeService.saveScore(questionNumber, teacherName);
  }

  @Get('/:questionNumber')
  async getScores(@Param('questionNumber') questionNumber: number) {
    return this.homeService.getScore(questionNumber);
  }

  @Get('')
  async getTotalScores() {
    return this.homeService.getTotalScore();
  }
}
