import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findMatchType(type: string): Promise<User[]> {
    return this.userModel.find({ type });
  }

  async createScore(userData: { score: number; type: string }) {
    const newScore = new this.userModel({
      score: userData.score,
      type: userData.type,
    });

    await newScore.save();
  }
}
