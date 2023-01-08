import { IsString } from 'class-validator';

export class twofacCode {
  @IsString()
  readonly code: string;
}
