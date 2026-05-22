import { Controller, Post, Body, Get, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
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

  @Get()
  async getSystemDesigns() {
    const designs = await this.systemDesignService.findAll();
    return {
      success: true,
      data: designs,
    };
  }

  @Get(':id')
  async getSystemDesign(@Param('id') id: string) {
    const design = await this.systemDesignService.findById(id);
    return {
      success: true,
      data: design,
    };
  }

  @Get(':id/generated-files')
  async getGeneratedFiles(@Param('id') id: string) {
    const result = await this.systemDesignService.getGeneratedFiles(id);
    return {
      success: true,
      data: result,
    };
  }

  @Post(':id/save-file')
  async saveGeneratedFile(
    @Param('id') id: string,
    @Body() body: { filePath: string; content: string },
  ) {
    await this.systemDesignService.saveGeneratedFile(id, body.filePath, body.content);
    return { success: true };
  }

  @Patch(':id/mark-scaffolded')
  async markScaffolded(@Param('id') id: string) {
    await this.systemDesignService.markScaffolded(id);
    return { success: true };
  }

  @Delete(':id')
  async deleteSystemDesign(@Param('id') id: string) {
    const result = await this.systemDesignService.deleteById(id);
    if (!result) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'Project soft-deleted successfully',
    };
  }
}

