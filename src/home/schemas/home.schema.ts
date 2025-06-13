import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop()
  question: number;

  @Prop({ type: Object, default: {} })
  scores: Record<string, number>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
