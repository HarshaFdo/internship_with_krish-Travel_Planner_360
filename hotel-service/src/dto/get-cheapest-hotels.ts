import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDateString, MinLength, MaxLength, IsNotEmpty, IsBoolean, IsIn } from 'class-validator';

export class GetCheapestHotelsDto {
  @IsNotEmpty({ message: 'from is required' })
  @IsString()
  destination!: string;

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'], { message: 'lateCheckIn must be "true" or "false"' })
  lateCheckIn?: string;
}