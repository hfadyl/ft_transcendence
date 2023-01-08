import { IsNotEmpty, IsString } from 'class-validator';

export class country {
  @IsString()
  @IsNotEmpty()
  country: string;
}
