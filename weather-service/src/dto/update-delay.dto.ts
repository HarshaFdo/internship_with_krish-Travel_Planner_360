import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDelayDto {
  @Type(() => Number)
  @IsInt({ message: 'delayMs must be an integer' })
  @Min(0, { message: 'delayMs must be at least 0' })
  @Max(30000, { message: 'delayMs must not exceed 30000 (30 seconds)' })
  delayMs!: number;
}