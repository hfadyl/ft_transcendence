import { IsNotEmpty, IsString } from 'class-validator';

export class username {
  @IsString()
  @IsNotEmpty()
  username: string;
}
