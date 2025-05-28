import { IsString, IsInt, Min, Max, IsEmail, IsOptional } from 'class-validator';

export class CreateDictatorDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  territory?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  number_of_slaves?: number;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  loyalty_to_carolina?: number;

  @IsEmail()
  @IsOptional()
  email?: string; 

  @IsString()
  @IsOptional()
  password?: string; 
}
