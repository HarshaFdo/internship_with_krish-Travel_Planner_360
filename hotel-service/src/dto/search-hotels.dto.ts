import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class SearchHotelsDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsDateString({}, {message: 'Date must be in YYYY-MM-DD format'})
  date?: string;

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'], { message: 'lateCheckIn must be "true" or "false"' })
  lateCheckIn?: string;
}