import { Module } from '@nestjs/common';
import { GeminiController } from './presenters/gemini.controller';
import { GeminiService } from './application/gemini.service';
import { GeminiProModelProvider } from './gemini.provider';
import { TeacherModule } from './chatbot/teacher.module';

@Module({
  imports: [TeacherModule],
  controllers: [GeminiController],
  providers: [
    GeminiService,
    GeminiProModelProvider,
  ],
  exports: [GeminiService, GeminiProModelProvider],
})
export class GeminiModule {}