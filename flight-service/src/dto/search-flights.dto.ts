import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class SearchFlightDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  from?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  to?: string;

  @IsOptional()
  @IsDateString({}, {message: 'Date must be in YYYY-MM-DD format'})
  date?: string;
}