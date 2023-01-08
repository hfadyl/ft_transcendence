import { IsNotEmpty, IsString } from 'class-validator';

export class fullname {
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
