import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(10)
  description: string;
}
