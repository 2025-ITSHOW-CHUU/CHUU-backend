import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from './schemas/teacher.schema';
import { Model } from 'mongoose';

@Injectable()
export class TeacherService {
  findByTeacherId(): Teacher | PromiseLike<Teacher> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
  ) {}

  async findPrompById(teacherId: string): Promise<string> {
    const teacher = await this.teacherModel.findById(teacherId).exec();
    if (!teacher) throw new NotFoundException('해당 선생님이 없습니다.');
    return teacher.prompt;
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherModel.find().exec();
  }

  async create(data: Partial<Teacher>): Promise<Teacher> {
    const created = new this.teacherModel(data);
    return created.save();
  }
}
