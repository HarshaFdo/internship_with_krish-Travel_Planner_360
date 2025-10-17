import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class SearchFlightDto {
  @IsOptional()
  @IsString()
  from!: string;

  @IsOptional()
  @IsString()
  to!: string;

  @IsOptional()
  @IsDateString({}, {message: 'Date must be in YYYY-MM-DD format'})
  date!: string;
}