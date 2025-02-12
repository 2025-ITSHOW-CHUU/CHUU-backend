import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop()
  question: number;

  @Prop({ type: Map, of: Number })
  scores: Map<string, number>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
