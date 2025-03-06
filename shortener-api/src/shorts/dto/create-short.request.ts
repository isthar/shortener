import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl, IsUUID } from 'class-validator';

export class CreateShortRequest {
  @IsUrl({ require_protocol: true })
  @ApiProperty({ required: true, example: 'https://www.example.com' })
  url: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    required: false,
    example: '0cbbb6ba-c7a4-4016-a9c5-002b41d0fadc',
  })
  ownerId?: string | undefined;
}
