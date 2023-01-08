import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class rid_uid {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly roomId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;
}
