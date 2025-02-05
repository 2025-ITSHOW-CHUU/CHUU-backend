import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findMatchType(type: string): Promise<User[]> {
    return this.userModel.find({ type }).exec(); // 간단하게 수정
  }

  async createUser(userData: { score: number; type: string }): Promise<User> {
    return this.userModel.create(userData);
  }
}
