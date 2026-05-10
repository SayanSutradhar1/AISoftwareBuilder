import { Controller, MessageEvent, Query, Req, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './models/chat.model';
import { Message } from './models/message.model';
import { type Request } from 'express';

@Controller('ai')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
  ) {}

  @Sse('stream')
  async stream(
    @Query('prompt') prompt: string,
    @Req() req: Request,
  ): Promise<Observable<MessageEvent>> {
    const chatId = req.body.chatId;

    const chat = await this.chatModel.findById(chatId).exec();

    if (!chat) {
      throw new Error('Chat not found');
    }

    return new Observable<MessageEvent>((observer) => {
      const controller = new AbortController();
      let isSubscribed = true;

      (async () => {
        try {
          const response = await this.chatService.generateStream(prompt);

          for await (const chunk of response) {
            if (!isSubscribed) break;
            observer.next({ data: chunk.response });
          }
          if (isSubscribed) {
            observer.complete();
          }
        } catch (error) {
          if (isSubscribed) {
            observer.error(error);
          }
        }
      })();

      return () => {
        isSubscribed = false;
        controller.abort();
      };
    });
  }
}
