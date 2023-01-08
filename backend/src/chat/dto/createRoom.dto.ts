import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createRoom {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly password?: string;

  @IsOptional()
  participants?: [];

  @IsString()
  @IsNotEmpty()
  readonly state: string;
}
