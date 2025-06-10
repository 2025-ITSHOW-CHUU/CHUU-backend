import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../dto/create-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatList(@Query('roomId') roomId: string) {
    return this.chatService.getChatsByUser(roomId);
  }
  // 특정 선생님과 채팅방
  @Get('gemini')
  async getChatByTeacher(
    @Query('teacherId') teachId: string,
    @Query('roomId') roomId: string,
  ) {
    return this.chatService.getChatsByTeacherAndUser(teachId, roomId);
  }
  // 새 메세지 보내기
  @Post()
  async chat(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.createChat(createMessageDto);
  }
}
