import { ApiProperty } from '@nestjs/swagger';
import { IsSlug } from '../decorators/is-slug.decorator';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateShortRequest {
  @IsSlug()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    required: true,
    example: 'abc123',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: '9cbbb6ba-c7a4-4016-a9c5-002b41d0fadc',
  })
  ownerId: string;
}
