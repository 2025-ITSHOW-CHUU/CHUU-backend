import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GeminiService } from '../application/gemini.service';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Teacher } from './schemas/teacher.schema';

@Injectable()
export class ChatService {
  getChatsByTeacherAndUser(teachId: string, roomId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    private readonly geminiService: GeminiService,
  ) {}
  // gemini 호출 함수
  async createChat(createMessageDto: CreateMessageDto) {
    const { teacherId, message, roomId } = createMessageDto;
    // 선생님 포트프트 불러오기
    const teacher = await this.teacherModel.findOne({ teacherId });
    if (!teacher) {
      throw new NotFoundException('해당 teacherId를 가져올 수 없습니다');
    }

    const prompt = teacher?.prompt || '';

    // geminiService 통해 답변 생성
    const genAiResponse = await this.geminiService.generateText(
      prompt,
      message,
    );
    // db 저장
    const createdChat = new this.chatModel({
      teacherId: teacher.id,
      roomId,
      message,
      response: genAiResponse.text,
    });

    await createdChat.save();
    return createdChat;
  }

  // 채팅 리스트 가져오기
  async getLatestChatsByUser(userId: string) {
    return this.chatModel.aggregate([
      { $match: { userId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$roomId',
          teacherId: { $first: '$teacherId' },
          message: { $first: '$message' },
          response: { $first: '$response' },
          createdAt: { $first: '$createdAt' },
        },
      },
    ]);
  }

  // roomId로 전체 채팅 불러오기
  async getChatsByRoomId(roomId: string) {
    return this.chatModel
      .find({ roomId })
      .sort({ createdAt: 1 })
      .populate('teacherId') // teacherId 정보 불러오기
      .exec();
  }

  async getChatsByUser(roomId: string) {
    return this.chatModel
      .find({ roomId })
      .sort({ createdAt: -1 }) //최신순
      .limit(50)
      .exec();
  }
}
