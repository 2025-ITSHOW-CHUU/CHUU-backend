import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from './schemas/home.schema';
import { EventGateway } from 'src/event/event.gateway';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<QuestionDocument>,
    private readonly eventGateway: EventGateway,
  ) {}

  async saveScore(questionNumber: number, name: string) {
    const updateQuery = { [name]: 1 };
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

      const maxVotes = await this.questionModel.findOne({
        question: questionNumber,
      });

      const sortedScores = Object.entries(maxVotes!.scores)
        .sort(([, a], [, b]) => b - a) // 값 기준 내림차순 정렬
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      console.log(sortedScores);

      this.eventGateway.server.emit('update-encate', {
        questionNumber: newQuestion.question,
        teacherName: Object.keys(sortedScores)[0],
        maxVotedTeacher: Object.values(sortedScores)[0],
      });

      return { message: 'success', scores: newQuestion.scores };
    }

    const updatedQuestion = await this.questionModel.findOneAndUpdate(
      { question: questionNumber },
      incrementQuery,
      { new: true, upsert: true },
    );

    const maxVotes = await this.questionModel.findOne({
      question: questionNumber,
    });

    const sortedScores = Object.entries(maxVotes!.scores)
      .sort(([, a], [, b]) => b - a) // 값 기준 내림차순 정렬
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    console.log(sortedScores);

    this.eventGateway.server.emit('update-encate', {
      questionNumber: updatedQuestion.question,
      teacherName: Object.keys(sortedScores)[0],
      maxVotedTeacher: Object.values(sortedScores)[0],
    });

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
      scores: questions.scores,
    };
  }

  async getTotalScore(): Promise<{ message: string; scores: object[] }> {
    const questions = await this.questionModel.find({});

    if (!questions) {
      return {
        message: 'fail',
        scores: [],
      };
    }

    return {
      message: 'success',
      scores: questions,
    };
  }
}
