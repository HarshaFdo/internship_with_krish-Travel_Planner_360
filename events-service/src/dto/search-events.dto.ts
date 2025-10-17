import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  MinLength,
  MaxLength,
} from "class-validator";
import { Type } from "class-transformer";

export class SearchEventsDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Destination must be at least 2 characters" })
  @MaxLength(100, { message: "Destination must not exceed 100 characters" })
  destination?: string;

  @IsOptional()
  @IsDateString({}, { message: "Date must be in YYYY-MM-DD format" })
  date?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Category must be at least 2 characters" })
  @MaxLength(50, { message: "Category must not exceed 50 characters" })
  category?: string;
}
