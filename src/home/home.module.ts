import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { Question, QuestionSchema } from './schemas/home.schema';
import { EventGateway } from 'src/event/event.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService, EventGateway],
  exports: [HomeService],
})
export class HomeModule {}
