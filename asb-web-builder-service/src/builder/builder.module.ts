import { Module } from '@nestjs/common';
import { SystemDesignModule } from './system-design/system-design.module';
import { GeneratorModule } from './generator/generator.module';

@Module({
  imports: [SystemDesignModule, GeneratorModule],
})
export class BuilderModule {}
