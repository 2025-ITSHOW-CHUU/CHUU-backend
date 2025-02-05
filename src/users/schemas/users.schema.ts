import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  score: number;

  @Prop()
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
