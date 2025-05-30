import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsDateString,
} from 'class-validator';
import { ContestantStatus } from '../entities/contestant.entity';

export class CreateContestantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsUUID()
  @IsNotEmpty()
  dictatorId: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  strength?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  agility?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  wins?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  losses?: number;

  @IsEnum(ContestantStatus)
  @IsOptional()
  status?: ContestantStatus;

  @IsDateString()
  @IsOptional()
  created_at?: string;
}
