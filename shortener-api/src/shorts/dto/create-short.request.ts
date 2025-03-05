import { ApiProperty } from '@nestjs/swagger';

export class CreateShortRequest {
  @ApiProperty({ example: 'https://www.google.com' })
  url: string;
}
