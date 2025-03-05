import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class CreateShortRequest {
  @IsUrl()
  @ApiProperty({ required: true, example: 'https://www.example.com' })
  url: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    example: '0cbbb6ba-c7a4-4016-a9c5-002b41d0fadc',
  })
  ownerId?: string | undefined;
}
