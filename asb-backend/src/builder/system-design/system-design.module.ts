import { Module } from '@nestjs/common';
import { SystemDesignController } from './system-design.controller';
import { SystemDesignService } from './system-design.service';
import { OllamaModule } from '../../ollama/ollama.module';

@Module({
  imports: [OllamaModule],
  controllers: [SystemDesignController],
  providers: [SystemDesignService],
  exports: [SystemDesignService],
})
export class SystemDesignModule {}
