import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Chat {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Message' }] })
  messages: Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
