import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OllamaService } from '../../ollama/ollama.service';
import { GenerateDesignDto } from './dto/generate-design.dto';
import { SystemDesign, SystemDesignDocument } from './schemas/system-design.schema';

@Injectable()
export class SystemDesignService {
  constructor(
    private readonly ollamaService: OllamaService,
    @InjectModel(SystemDesign.name) private systemDesignModel: Model<SystemDesignDocument>,
  ) {}

  async generateSystemDesign(dto: GenerateDesignDto) {
    const prompt = `
You are an Elite Software Architect, Principal Engineer, and System Designer.
Your objective is to ingest high-level user requirements and synthesize them into an extremely detailed, production-ready system architecture.
The output will be used by an automated generator engine to scaffold the entire application. Accuracy, depth, and technical rigor are paramount.

Here are the requirements provided by the user:
- Service Type: ${dto.serviceType}
- Description: ${dto.description}
- Data Flow: ${dto.dataFlow}

=== CRITICAL RECTIFICATION & TECH STACK OBEDIENCE RULES ===
1. STRICT USER TECH STACK OBEDIENCE: Analyze the description and data flow for any explicit requests regarding programming languages, frameworks (e.g. Next.js, NestJS, Express, React, Vite, Django, Laravel), state managers, databases (e.g. MongoDB, PostgreSQL), styling engines, or tools. You MUST strictly obey and construct the blueprint matching the user's specific choices. You are strictly forbidden from substituting other frameworks or technologies (e.g. if the user requests "Next.js", the scaffold MUST be Next.js and MUST NOT contain NestJS controllers or modules).
2. AI AUTONOMY FOR INDIFFERENT LAYERS: If the user has not specified a framework, language, or database for a particular layer, you have full autonomy to select the most modern, optimized, industry-standard, and cohesive stack (e.g. React/Vite + Tailwind CSS + Node.js/Express + PostgreSQL) that solves the user's problem.

=== DYNAMIC CANONICAL DIRECTORY CONVENTIONS ===
The "folderStructure" array MUST NOT follow a rigid, hardcoded, or generic template. Instead, it must dynamically adapt and strictly conform to the official, industry-graded, and canonical directory structure of the chosen stack:
- Next.js (App Router): Must use the standard App Router directory layout (\`src/app/layout.tsx\`, \`src/app/page.tsx\`, \`src/app/globals.css\`, route handlers under \`src/app/api/...\`, custom components under \`src/components/\`, config files like \`next.config.js\`, \`tailwind.config.js\`). Do NOT include NestJS modules or controllers.
- NestJS: Must follow NestJS modular structural layout (e.g. \`src/auth/auth.module.ts\`, \`src/auth/auth.controller.ts\`, \`src/auth/auth.service.ts\`, config file \`nest-cli.json\`).
- Vite + React: Must follow standard React SPA layout (e.g. \`src/components/\`, \`src/pages/\`, \`src/hooks/\`, \`src/main.tsx\`, \`vite.config.ts\`).
- Node / Express: Must follow MVC controllers/routes structure (e.g. \`src/controllers/\`, \`src/routes/\`, \`src/models/\`, \`src/app.ts\`).
- Django / Laravel / Spring Boot / Rails: Must strictly follow the official and standard industry-graded folder layout conventions of those ecosystems.

Consider scalability, security, maintainability, and modern best practices (e.g., state management paradigms, indexing, caching strategies).

Your response MUST be a valid JSON object matching the following structure exactly. 
The internal modules will use the structured JSON, but 'detailedArchitectureText' will be rendered to the user as markdown.

{
  "detailedArchitectureText": "A comprehensive, beautifully formatted Markdown text explaining the system architecture. Include sections for: Executive Summary, System Architecture Diagram (Mermaid.js), Core Technologies, Data Flow, Security Considerations, Scalability Strategy, and Deployment Architecture.",
  "folderStructure": [
    {
      "path": "Dynamic file path matching the standard industry-graded directory layout of the selected framework/language. For Next.js App Router, this must follow src/app/... format. For NestJS, it must follow src/... modular format.",
      "type": "file | directory",
      "description": "Precise details of what this file or folder handles in the system."
    }
    // Generate a fully comprehensive, production-ready directory structure mapping all necessary config files (e.g. package.json, tsconfig.json, next.config.js, tailwind.config.js, etc.), folders, and source files required to bootstrap this specific chosen stack.
  ],
  "frontend": {
    "framework": "Specify exact framework and version (e.g., Next.js 14 App Router, React with Vite 5)",
    "styling": "Tailwind CSS, Styled Components, etc.",
    "stateManagement": "Specify libraries (Zustand, Redux Toolkit, React Query) and their exact use cases.",
    "routing": "Description of the routing tree and guarded routes.",
    "components": [
      {
        "name": "ComponentName",
        "path": "src/components/.../ComponentName.tsx (or corresponding standard path of the chosen framework)",
        "description": "Deep dive into component responsibilities.",
        "props": [
           {"name": "propName", "type": "string", "required": true}
        ],
        "stateVars": ["local state variables needed"],
        "hooksRequired": ["useAuth", "useQuery"]
      }
    ]
  },
  "backend": {
    "framework": "NestJS, Express, Django, etc.",
    "architecturePattern": "Module-driven, MVC, CQRS, etc.",
    "database": "Exact DB technology (PostgreSQL, MongoDB)",
    "orm": "Prisma, TypeORM, Mongoose",
    "cachingStrategy": "Redis usage, Memcached, or None",
    "backgroundJobs": "BullMQ, cron jobs, etc.",
    "apiEndpoints": [
      {
        "method": "GET | POST | PUT | DELETE",
        "path": "/api/v1/...",
        "description": "Detailed business logic expected here.",
        "requestPayload": { "field": "type" },
        "responsePayload": { "field": "type" },
        "authRequired": true
      }
    ],
    "models": [
      {
        "name": "ModelName",
        "description": "Purpose of the model.",
        "fields": [
          { "name": "fieldName", "type": "string", "isUnique": false, "isNullable": false, "relationTo": "OtherModel (or null)" }
        ],
        "indexes": ["field1", "field2"]
      }
    ],
    "thirdPartyIntegrations": [
      {
        "provider": "Stripe, SendGrid, etc.",
        "purpose": "What this service handles"
      }
    ]
  },
  "security": {
    "authentication": "JWT, OAuth2, Session-based",
    "authorization": "RBAC, ABAC details",
    "dataProtection": "Encryption at rest/transit strategies"
  },
  "deployment": {
    "ciCdPipeline": "GitHub Actions steps, GitLab CI, etc.",
    "frontendHosting": "Vercel, AWS S3/CloudFront",
    "backendHosting": "AWS ECS, Docker, Render",
    "databaseHosting": "RDS, MongoDB Atlas"
  }
}

Output ONLY the JSON object. Do not include markdown formatting like \`\`\`json or additional explanations outside the JSON. Ensure the JSON is perfectly valid.
`;

    const systemDesignJSON = await this.ollamaService.generateJSON(prompt);
    
    // Save to database
    const savedDesign = new this.systemDesignModel({
      ...systemDesignJSON,
      projectName: dto.projectName || 'Unnamed Project',
      serviceType: dto.serviceType,
      description: dto.description,
    });
    await savedDesign.save();
    
    return savedDesign;
  }

  async findAll() {
    return this.systemDesignModel.find({ isDeleted: { $ne: true } })
      .select('projectName serviceType description createdAt')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string) {
    return this.systemDesignModel.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
  }

  async getGeneratedFiles(id: string) {
    const design = await this.systemDesignModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .select('generatedFiles isScaffolded')
      .exec();
    if (!design) return null;
    return {
      isScaffolded: design.isScaffolded,
      generatedFiles: design.generatedFiles ?? {},
    };
  }

  async deleteById(id: string) {
    return this.systemDesignModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
    ).exec();
  }

  async saveGeneratedFile(id: string, filePath: string, content: string) {
    const design = await this.systemDesignModel.findById(id).exec();
    if (!design) return null;

    if (!design.generatedFiles) {
      design.generatedFiles = {};
    }

    // Set the property directly in Javascript (keys are treated as literal strings with dots)
    design.generatedFiles[filePath] = content;

    // Explicitly mark the mixed field as modified so Mongoose knows to persist it
    design.markModified('generatedFiles');

    return design.save();
  }

  async markScaffolded(id: string) {
    return this.systemDesignModel
      .findByIdAndUpdate(id, { $set: { isScaffolded: true } }, { new: true })
      .exec();
  }
}
