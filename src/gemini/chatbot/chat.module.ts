import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { TeacherModule } from './teacher.module';
import { GeminiService } from '../application/gemini.service';
import { GeminiModule } from '../gemini.module';
import { Teacher, TeacherSchema } from './schemas/teacher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Teacher.name, schema: TeacherSchema },
    ]),
    forwardRef(() => TeacherModule),
    // 순환 의존성 해결
    forwardRef(() => GeminiModule),
  ],
  controllers: [ChatController],
  providers: [ChatService, GeminiService],
  exports: [ChatService],
})
export class ChatModule {}
