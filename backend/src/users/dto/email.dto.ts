import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Email {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
