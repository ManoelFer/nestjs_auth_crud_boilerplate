import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class AccessLevelDto {
  @ApiProperty()
  @IsNotEmpty()
  userId?: number;

  @ApiProperty()
  @IsNotEmpty()
  roles: [];
}
