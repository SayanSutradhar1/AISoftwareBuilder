import { Controller, Post, Body } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GenerateFileDto } from './dto/generate-file.dto';

@Controller('builder/generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post('generate-file')
  async generateFileContent(@Body() dto: GenerateFileDto) {
    const generated = await this.generatorService.generateFileContent(dto);
    return {
      success: true,
      data: generated,
    };
  }
}
