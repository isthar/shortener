import {
  Controller,
  Get,
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
  async redirect(@Param('slug') slug: string): Promise<Url> {
    const url = await this.shortsService.findShort(slug);

    if (!url) {
      throw new NotFoundException();
    }
    return url;
  }
}
