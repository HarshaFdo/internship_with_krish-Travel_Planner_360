import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class SearchEventsDto {
  @IsOptional()
  @IsString()
  destination!: string;

  @IsOptional()
  @IsDateString({}, { message: "Date must be in YYYY-MM-DD format" })
  date?: string;

  @IsOptional()
  @IsString()
  category!: string;
}
