import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ required: true })
  teacher: string;

  @Prop({ unique: false })
  comment: string;

  @Prop({ required: true, unique: true })
  image?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
