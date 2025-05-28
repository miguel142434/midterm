import { IsBoolean, IsOptional, IsString, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBattleDto {
    @IsUUID()
    readonly contestant_1_id: string;

    @IsUUID()
    readonly contestant_2_id: string;

    @IsUUID()
    @IsOptional()
    readonly winner_id?: string;

    @IsBoolean()
    @IsOptional()
    readonly death_occurred?: boolean;

    @IsString()
    @IsOptional()
    readonly injuries?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    readonly date?: Date; 
}
