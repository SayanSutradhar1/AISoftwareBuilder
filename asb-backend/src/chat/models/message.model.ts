import { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Chat' })
  chatId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  sender: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
