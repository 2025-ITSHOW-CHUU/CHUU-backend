import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(
      @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>
  ) {}
  
  private nameMemory = new Map<string, string>();

  // 이름 로직 설정 및 초기화
  setUserName(roomId: string, name: string) {
    this.nameMemory.set(roomId, name);
  }

  getUserName(roomId: string): string | null {
    return this.nameMemory.get(roomId) ?? null;
  }

  clearUserName(roomId: string) {
    this.nameMemory.delete(roomId);
  }   

  // gemini 호출 함수, user / assistant 별로 관리
  async createChat(data: {
    roomId: string;
    teacherId: string;
    message: string;
    role: 'user' | 'assistant';
  }): Promise<Chat> {
    const chat = new this.chatModel(data);
    return chat.save();
  }

  // 특정 선생님 채팅방 내역 조회
  async getChatsByTeacher(teacherId: string, roomId?: string): Promise<Chat[]> {
    const filter: any = { teacherId };

    if(roomId) {
      filter.roomId = roomId;
    }

    const result = await this.chatModel
      .find(filter)
      .sort({ createdAt: 1 })
      .select('role message createdAt roomId teacherId')
      .lean()
      .exec();

    return result;
  
  }

  // 최근 메세지 불러오기
  async getChatsByRoom(roomId: string): Promise<any[]> {
    return this.chatModel
      .find({ roomId })
      .sort({ createdAt: 1 })
      .exec();
  }

  // assistant 최근 메세지
  async getLastAssistantMessagesByRoom(): Promise<any[]> {
    return this.chatModel.aggregate([
      { $match: { role: 'assistant' } },  // assistant 메시지만 필터
      { $sort: { createdAt: -1 } },
      { $group: {
          _id: '$roomId',
          teacherId: { $first: '$teacherId' },
          lastReply: { $first: '$message' },
          lastMessageTime: { $first: '$createdAt' }
      }},
      {
        $project: {
            _id: 0,
            roomId: '$_id',
            teacherId: 1,
            lastReply: 1,
            lastMessageTime: 1
        }
      }
    ]);
  }
}