import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { EventGateway } from 'src/event/event.gateway';

@Injectable()
export class UserService implements OnModuleInit {
  private totalUserTest = 0;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly eventGateway: EventGateway,
  ) {}

  async onModuleInit() {
    const totalTest = await this.userModel.countDocuments();

    this.totalUserTest = totalTest;

    this.eventGateway.server.emit('update-totaluser', {
      totalUser: totalTest,
    });
    console.log('초기 총 참여자 수:', this.totalUserTest);
  }

  async findMatchType(type: string): Promise<User[]> {
    return this.userModel.find({ type });
  }

  async createScore(userData: { score: number; type: string }) {
    const newScore = new this.userModel({
      score: userData.score,
      type: userData.type,
    });

    this.totalUserTest += 1;
    this.eventGateway.server.emit('update-totaluser', {
      totalUser: this.totalUserTest,
    });

    await newScore.save();
  }

  async getTotalUser() {
    const totalUser = await this.userModel.countDocuments();
    return totalUser;
  }
}
