import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ShortsService } from './shorts.service';
import { UpdateShortRequest } from './dto/update-short.request';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateShortRequest } from './dto/create-short.request';

@Controller('/api')
export class ShortsController {
  constructor(private readonly shortsService: ShortsService) {}

  @Post('shorten')
  @ApiBody({ type: CreateShortRequest })
  @ApiOperation({ summary: 'Create shorter url' })
  createShort(@Body() createShortDto: CreateShortRequest) {
    return this.shortsService.createShort(createShortDto);
  }

  @Get('find-shorts-of/:userId')
  @ApiOperation({ summary: 'Get short urls created by yser' })
  findShortsOfUser(@Param('userId') userId: string) {
    return this.shortsService.findShortsOfUser(userId);
  }

  @Patch('update-short/:slug')
  @ApiOperation({ summary: 'Update shorter url' })
  updateShortcut(
    @Param('slug') id: string,
    @Body() updateShortDto: UpdateShortRequest,
  ) {
    return this.shortsService.updateShort(id, updateShortDto);
  }
}
