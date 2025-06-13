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
    await this.teacherModel.deleteMany({});  // 기존 데이터 모두 삭제
    await this.seedTeachers();
    console.log('✅ Teacher seed 완료');
    // const isSeeded = await this.isSeeded();
    // if(!isSeeded) {
    //   await this.seedTeachers();
    //   console.log('✅ Teacher seed 완료');
    // }
  }

  private async seedTeachers() {
    const teachers = Object.entries(teacherPrompts).map(([teacherId, data]) => ({
      teacherId,
      name: data.name,
      personality: data.personality,
      prompt: data.prompt,
      // imagePath: `images/${teacherId}.svg`,
      specialties: data.specialties || [],
    }));
    await this.teacherModel.insertMany(teachers); 
  }
}
