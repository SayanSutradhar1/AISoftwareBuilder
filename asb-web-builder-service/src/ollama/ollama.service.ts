import { Injectable } from '@nestjs/common';
import { Ollama } from 'ollama';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OllamaService {
  private readonly ollama: Ollama;

  constructor(private readonly configService: ConfigService) {
    const ollamaApiKey = this.configService.get<string>('OLLAMA_API_KEY');

    this.ollama = new Ollama({
      host: 'https://ollama.com',
      headers: {
        Authorization: `Bearer ${ollamaApiKey}`,
      },
    });
  }

  async generateStream(prompt: string) {
    const response = await this.ollama.generate({
      model: 'gpt-oss:120b',
      prompt: prompt,
      stream: true,
    });

    return response;
  }

  async generateJSON(prompt: string) {
    const response = await this.ollama.generate({
      model: 'gpt-oss:120b',
      prompt: prompt,
      stream: false,
      format: 'json',
    });

    return JSON.parse(response.response);
  }

  async generateText(prompt: string) {
    const response = await this.ollama.generate({
      model: 'gpt-oss:120b',
      prompt: prompt,
      stream: false,
    });

    return response.response;
  }
}
