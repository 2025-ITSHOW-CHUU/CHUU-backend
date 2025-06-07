import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ required: true })
    roomId: string;

    @Prop({ type: Types.ObjectId, ref: 'Teacher', required: true})
    teacherId: Types.ObjectId;  

    @Prop({ required: true})
    message: string;    

    @Prop()
    response: string;   

    @Prop({ default: false })
    read: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);