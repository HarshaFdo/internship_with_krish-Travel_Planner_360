import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsString} from "class-validator";


export class TripSearchDto {
  @IsNotEmpty({message: 'from is required'})
  @IsString({message: 'from must be a valid string'})
  from!: string;

  @IsNotEmpty({message: 'to is required'})
  @IsString({message: 'from must be a valid string'})
  to!: string;

  @IsNotEmpty({message: 'from is required'})
  @IsDateString({}, {message: 'Date must be in YYYY-MM-DD format'})
  date!: string;
}