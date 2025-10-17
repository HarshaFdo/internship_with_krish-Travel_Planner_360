import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class SearchFlightDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  from!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  to!: string;

  @IsNotEmpty()
  @IsDateString({}, {message: 'Date must be in YYYY-MM-DD format'})
  date!: string;
}