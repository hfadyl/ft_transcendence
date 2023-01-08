import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class phonenumber {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
