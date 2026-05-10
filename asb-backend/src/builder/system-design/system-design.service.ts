import { Injectable } from '@nestjs/common';
import { OllamaService } from '../../ollama/ollama.service';
import { GenerateDesignDto } from './dto/generate-design.dto';

@Injectable()
export class SystemDesignService {
  constructor(private readonly ollamaService: OllamaService) {}

  async generateSystemDesign(dto: GenerateDesignDto) {
    const prompt = `
You are an Elite Software Architect, Principal Engineer, and System Designer.
Your objective is to ingest high-level user requirements and synthesize them into an extremely detailed, production-ready system architecture.
The output will be used by an automated generator engine to scaffold the entire application. Accuracy, depth, and technical rigor are paramount.

Here are the requirements provided by the user:
- Service Type: ${dto.serviceType}
- Description: ${dto.description}
- Data Flow: ${dto.dataFlow}

Based on these requirements, generate a deeply comprehensive, low-level System Design Architecture. 
Consider scalability, security, maintainability, and modern best practices (e.g., microservices vs monolith, state management paradigms, caching, indexing).

Your response MUST be a valid JSON object matching the following structure exactly. 
The internal modules will use the structured JSON, but 'detailedArchitectureText' will be rendered to the user as markdown.

{
  "detailedArchitectureText": "A comprehensive, beautifully formatted Markdown text explaining the system architecture. Include sections for: Executive Summary, System Architecture Diagram (Mermaid.js), Core Technologies, Data Flow, Security Considerations, Scalability Strategy, and Deployment Architecture.",
  "folderStructure": [
    {
      "path": "src/modules/auth/auth.controller.ts",
      "type": "file",
      "description": "Precise description of what this specific file does and what it contains."
    }
    // MUST be a fully comprehensive list covering every essential file and folder needed to bootstrap the project, including config files.
  ],
  "frontend": {
    "framework": "Specify exact framework and version (e.g., Next.js 14 App Router)",
    "styling": "Tailwind CSS, Styled Components, etc.",
    "stateManagement": "Specify libraries (Zustand, Redux Toolkit, React Query) and their exact use cases.",
    "routing": "Description of the routing tree and guarded routes.",
    "components": [
      {
        "name": "ComponentName",
        "path": "src/components/.../ComponentName.tsx",
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
    "framework": "NestJS, Express, etc.",
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
    return systemDesignJSON;
  }
}
