import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateFileDto {
  @IsString()
  @IsNotEmpty()
  systemDesignId: string;

  @IsString()
  @IsNotEmpty()
  filePath: string;
}
