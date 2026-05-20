import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneratorController } from './generator.controller';
import { GeneratorService } from './generator.service';
import { OllamaModule } from '../../ollama/ollama.module';
import { SystemDesign, SystemDesignSchema } from '../system-design/schemas/system-design.schema';

@Module({
  imports: [
    OllamaModule,
    MongooseModule.forFeature([{ name: SystemDesign.name, schema: SystemDesignSchema }])
  ],
  controllers: [GeneratorController],
  providers: [GeneratorService],
})
export class GeneratorModule {}
