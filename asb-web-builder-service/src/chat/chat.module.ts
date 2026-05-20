import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { OllamaModule } from 'src/ollama/ollama.module';
import { Chat, ChatSchema } from './models/chat.model';
import { Message, MessageSchema } from './models/message.model';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [
    OllamaModule,
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
})
export class ChatModule {}
