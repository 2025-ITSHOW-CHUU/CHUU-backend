import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/home.schema';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
  ) {}

  async saveScore(questionNumber: number, name: string) {
    const questionData = this.questionModel.findOne({
      question: questionNumber,
    });

    if (!questionData) {
      const newQuestion = new this.questionModel({
        question: questionNumber,
        scores: new Map([[name, 1]]),
      });

      return await newQuestion.save();
    }

    await this.questionModel.updateOne(
      { question: questionNumber },
      { $inc: { [`scores.${name}`]: 1 } },
    );
  }

  async getScore(
    questionNumber: number,
  ): Promise<{ message: string; scores: object }> {
    const questions = await this.questionModel.findOne({
      question: questionNumber,
    });

    if (!questions) {
      return {
        message: 'fail',
        scores: [],
      };
    }

    return {
      message: 'success',
      scores: Object.fromEntries(questions.scores),
    };
  }
}
