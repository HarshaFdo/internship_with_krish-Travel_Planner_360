import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsDateString, MinLength, MaxLength, IsNotEmpty, IsBoolean, IsIn } from 'class-validator';

export class GetCheapestHotelsDto {
  @IsNotEmpty({ message: 'from is required' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  destination!: string;

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'], { message: 'lateCheckIn must be "true" or "false"' })
  lateCheckIn?: string;
}