import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class roomId {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly roomId: string;
}
