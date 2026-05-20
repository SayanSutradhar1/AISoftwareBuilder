import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SystemDesignDocument = SystemDesign & Document;

@Schema({ timestamps: true })
export class SystemDesign {
  @Prop({ required: true })
  detailedArchitectureText: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], required: true })
  folderStructure: any[];

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  frontend: any;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  backend: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  security: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  deployment: any;

  @Prop({ default: false })
  isScaffolded: boolean;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  generatedFiles: Record<string, string>;
}

export const SystemDesignSchema = SchemaFactory.createForClass(SystemDesign);
