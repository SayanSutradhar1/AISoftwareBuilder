import { Controller, Post, Body } from '@nestjs/common';
import { SystemDesignService } from './system-design.service';
import { GenerateDesignDto } from './dto/generate-design.dto';

@Controller('builder/system-design')
export class SystemDesignController {
  constructor(private readonly systemDesignService: SystemDesignService) {}

  @Post()
  async generateSystemDesign(@Body() dto: GenerateDesignDto) {
    const design = await this.systemDesignService.generateSystemDesign(dto);
    return {
      success: true,
      data: design,
    };
  }
}
