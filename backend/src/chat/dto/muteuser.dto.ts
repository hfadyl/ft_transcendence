import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class muteUser {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly roomId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly duration: string;
}
