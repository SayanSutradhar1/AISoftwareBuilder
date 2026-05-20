import { Module } from '@nestjs/common';
import { SystemDesignController } from './system-design.controller';
import { SystemDesignService } from './system-design.service';
import { OllamaModule } from '../../ollama/ollama.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SystemDesign, SystemDesignSchema } from './schemas/system-design.schema';

@Module({
  imports: [
    OllamaModule,
    MongooseModule.forFeature([{ name: SystemDesign.name, schema: SystemDesignSchema }])
  ],
  controllers: [SystemDesignController],
  providers: [SystemDesignService],
  exports: [SystemDesignService],
})
export class SystemDesignModule {}
