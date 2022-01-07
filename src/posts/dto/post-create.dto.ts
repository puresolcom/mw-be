import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostCreateDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @IsArray()
  @IsOptional()
  categories?: string[];
  @IsArray()
  @IsOptional()
  tags?: string[];
}
