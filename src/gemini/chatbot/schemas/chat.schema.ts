import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ required: true })
    roomId: string;

    @Prop({ required: true})
    teacherId: string;  

    @Prop({ required: true})
    message: string;    

    @Prop()
    response?: string;   

    @Prop({ required: true, enum: ['user', 'assistant'] })
    role: 'user' | 'assistant';

    @Prop({ default: false })
    read?: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);