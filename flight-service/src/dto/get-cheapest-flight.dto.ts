import { IsString, IsOptional, IsDateString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class GetCheapestFlightDto {
  @IsNotEmpty({ message: 'from is required' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  from!: string;

  @IsNotEmpty({ message: 'to is required' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  to!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date must be in YYYY-MM-DD format' })
  date?: string;
}