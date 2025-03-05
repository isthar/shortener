import {
  Controller,
  Get,
  Ip,
  NotFoundException,
  Param,
  Redirect,
} from '@nestjs/common';
import { ShortsService } from './shorts.service';
import { ApiParam, ApiTemporaryRedirectResponse } from '@nestjs/swagger';
import { Url } from './domain/vo/url';

@Controller('/')
export class ShortsRedirectController {
  constructor(private readonly shortsService: ShortsService) {}

  @Get('/:slug')
  @ApiTemporaryRedirectResponse()
  @ApiParam({ name: 'slug', type: 'string' })
  @Redirect()
  async redirect(@Param('slug') slug: string, @Ip() ip: string): Promise<Url> {
    const short = await this.shortsService.findShort(slug);

    if (!short) {
      throw new NotFoundException();
    }

    this.shortsService.trackVisit(short, ip);

    return new Url(short.url);
  }
}
