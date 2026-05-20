import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OllamaService } from '../../ollama/ollama.service';
import { GenerateFileDto } from './dto/generate-file.dto';
import { SystemDesign, SystemDesignDocument } from '../system-design/schemas/system-design.schema';

@Injectable()
export class GeneratorService {
  constructor(
    private readonly ollamaService: OllamaService,
    @InjectModel(SystemDesign.name) private systemDesignModel: Model<SystemDesignDocument>,
  ) {}

  async generateFileContent(dto: GenerateFileDto) {
    const { systemDesignId, filePath } = dto;

    const systemDesign = await this.systemDesignModel.findById(systemDesignId);
    if (!systemDesign) {
      throw new NotFoundException(`System Design with ID ${systemDesignId} not found`);
    }

    // Find the file description in the folder structure
    const fileNode = systemDesign.folderStructure.find(node => node.path === filePath);
    if (!fileNode) {
      throw new NotFoundException(`File path ${filePath} not found in the system design folder structure`);
    }

    const contextJson = {
      frontend: systemDesign.frontend,
      backend: systemDesign.backend,
      security: systemDesign.security,
      deployment: systemDesign.deployment,
    };

    const prompt = `
You are an Expert Senior Developer. Your task is to write the complete source code for a specific file based on the provided system architecture and file description.
DO NOT provide any explanations or markdown formatting outside of the code. JUST RETURN THE RAW SOURCE CODE.

File Path: ${filePath}
File Description: ${fileNode.description}

Here is the context of the overall system architecture:
${JSON.stringify(contextJson, null, 2)}

Write the full, production-ready code for ${filePath}. Include necessary imports based on the described framework, error handling, and business logic.
If it is a JSON or config file, output valid JSON or config syntax.
Do not use markdown code blocks like \`\`\`typescript. Just output the raw code.
`;

    let generatedCode = await this.ollamaService.generateText(prompt);
    
    // Clean up potential markdown formatting that the AI might still add
    generatedCode = generatedCode.replace(/^```[\w]*\n/i, '').replace(/\n```$/i, '');

    return {
      filePath,
      content: generatedCode,
    };
  }
}
