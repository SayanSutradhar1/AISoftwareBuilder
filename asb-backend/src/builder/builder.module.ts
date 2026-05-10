import { Module } from '@nestjs/common';
import { SystemDesignModule } from './system-design/system-design.module';

@Module({
  imports: [SystemDesignModule],
})
export class BuilderModule {}
