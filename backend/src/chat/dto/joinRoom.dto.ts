import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class joinRoom {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  readonly roomId: string;

  @IsString()
  @IsOptional()
  readonly password?: string;
}
