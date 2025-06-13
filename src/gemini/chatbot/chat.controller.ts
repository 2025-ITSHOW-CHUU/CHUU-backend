import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { GeminiService } from '../application/gemini.service';
import { teacherPrompts } from 'src/configs/teacher.data';

@Controller('chatbot')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly geminiService: GeminiService,
  ) {}

  // teacherId에 맞는 선생님 정보
  @Get(':teacherId')
  getTeacherInfo(@Param('teacherId') teacherId: string) {
    const teacher = teacherPrompts[teacherId];
    if (!teacher) {
      throw new NotFoundException('해당 선생님 정보를 찾을 수 없습니다.');
    }
    return teacher;
  }

  // roomId 생성
  @Post('createRoom')
  async createRoom(@Body() body: { teacherId: string }) {
    const { teacherId } = body;

    if (!teacherId) {
      throw new BadRequestException('teacherId가 필요합니다');
    }
    // roomId = (teacherId + timestamp + random)
    const roomId = `${teacherId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      roomId,
      teacherId,
      message: `${teacherId} 선생님과의 새로운 채팅방이 생성되었습니다.`,
    };
  }

  // 특정 teacherId와 roomId로 채팅 내역 조회
  @Get()
  async getChats(
    @Query('teacherId') teacherId: string,
    @Query('roomId') roomId?: string,
  ) {
    console.log('🎯 컨트롤러 받은 파라미터:', { teacherId, roomId });

    if (!teacherId) {
      throw new BadRequestException('teacherId가 필요합니다.');
    }

    const result = await this.chatService.getChatsByTeacher(teacherId, roomId);

    // 2. 선생님 정보 가져오기
    const teacherInfo = teacherPrompts[teacherId];
    if (!teacherInfo) {
      throw new NotFoundException('해당 선생님 정보를 찾을 수 없습니다.');
    }

    // 3. 채팅 내역에 선생님 이미지 정보 추가
    const enrichedChatHistory = result.map((chat) => ({
      ...chat,
      // assistant 메시지인 경우에만 imagePath 추가
      imagePath: chat.role === 'assistant' ? teacherInfo.imagePath : undefined,
    }));

    console.log('🎯 컨트롤러 반환 결과 : ', result);

    return enrichedChatHistory;
  }
  catch(error) {
    console.error('채팅 내역 조회 실패:', error);
    throw error;
  }

  // 전체 teacher 최근 메세지 불러오기
  @Get('last-replies')
  async getLastRepliesByRoom() {
    return this.chatService.getLastAssistantMessagesByRoom();
  }

  // 새 메세지 보내기
  @Post()
  async chat(@Body() createMessageDto: CreateMessageDto) {
    console.log('👩 사용자로부터 받은 메시지:', createMessageDto.message);

    const { roomId, teacherId, message } = createMessageDto;

    // 1. 사용자 메시지 저장
    const userMessage = await this.chatService.createChat({
      roomId: createMessageDto.roomId,
      teacherId: createMessageDto.teacherId,
      message: createMessageDto.message,
      role: 'user',
    });

    // 현재 기억된 사용자 이름 가져오기
    const currentUserName = '미림';

    // 2. Gemini 응답 생성
    const geminiResponse = await this.geminiService.generateText(
      teacherId,
      message,
      roomId,
      currentUserName ?? undefined,
    );
    // 3. Gemini 응답 저장
    const assistantMessage = await this.chatService.createChat({
      roomId: createMessageDto.roomId,
      teacherId: createMessageDto.teacherId,
      message: geminiResponse.text,
      role: 'assistant',
    });

    console.log('🤖 Gemini 응답:', geminiResponse.text);

    return {
      user: userMessage,
      assistant: {
        ...assistantMessage,
        response: geminiResponse.text,
      },
    };
  }
}
