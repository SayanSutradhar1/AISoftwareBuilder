import { Injectable } from '@nestjs/common';
import { OllamaService } from 'src/ollama/ollama.service';

@Injectable()
export class ChatService {
  constructor(private readonly ollamaService: OllamaService) {}

  async generateStream(prompt: string) {
    const response = await this.ollamaService.generateStream(prompt);
    return response;
  }
}
