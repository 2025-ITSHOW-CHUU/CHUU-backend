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
    const updateQuery = { [`scores.${name}`]: 1 };
    const incrementQuery = { $inc: { [`scores.${name}`]: 1 } };

    const questionData = await this.questionModel.findOne({
      question: questionNumber,
    });

    if (!questionData) {
      const newQuestion = new this.questionModel({
        question: questionNumber,
        scores: updateQuery,
      });
      await newQuestion.save();
      return { message: 'success', scores: newQuestion.scores };
    }

    const updatedQuestion = await this.questionModel.findOneAndUpdate(
      { question: questionNumber },
      incrementQuery,
      { new: true, upsert: true },
    );

    return { message: 'success', scores: updatedQuestion.scores };
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
