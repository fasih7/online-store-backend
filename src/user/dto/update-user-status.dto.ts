import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../utils/enums';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: Status,
    description: 'The new status for the user',
    example: Status.active,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
