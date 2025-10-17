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
  @IsNotEmpty()
  @IsString()
  destination!: string;

  @IsOptional()
  @IsDateString({}, { message: "Date must be in YYYY-MM-DD format" })
  date?: string;

  @IsNotEmpty()
  @IsString()
  category!: string;
}
