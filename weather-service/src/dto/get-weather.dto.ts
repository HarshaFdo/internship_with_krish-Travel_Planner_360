import { 
  IsString, 
  IsOptional, 
  IsDateString,
  MinLength,
  MaxLength,
  IsNotEmpty
} from 'class-validator';

export class GetWeatherDto {
  @IsNotEmpty({ message: 'destination is required' })
  @IsString()
  @MinLength(2, { message: 'Destination must be at least 2 characters' })
  @MaxLength(100, { message: 'Destination must not exceed 100 characters' })
  destination!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date must be in YYYY-MM-DD format' })
  date?: string;
}