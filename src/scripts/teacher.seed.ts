import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../gemini/chatbot/schemas/teacher.schema';
import { teacherPrompts } from 'src/configs/teacher.data';

@Injectable()
export class TeacherSeeder implements OnModuleInit {
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {}

  async onModuleInit() {
    const isSeeded = await this.isSeeded();
    if(!isSeeded) {
      await this.seedTeachers();
      console.log('✅ Teacher seed 완료');
    }
  }
  
  private async isSeeded(): Promise<boolean> {
    const count = await this.teacherModel.estimatedDocumentCount();
    return count > 0;
  }

  private async seedTeachers() {
    const teachers = Object.entries(teacherPrompts).map(([teacherId, data]) => ({
      teacherId,
      name: data.name,
      prompt: data.prompt,
    }));
    await this.teacherModel.insertMany(teachers);
  }
}
