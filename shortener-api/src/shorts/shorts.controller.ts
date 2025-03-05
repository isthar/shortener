import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ShortsService } from './shorts.service';
import { UpdateShortRequest } from './dto/update-short.request';
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateShortRequest } from './dto/create-short.request';
import { ShortResponse } from './dto/short.response';

import { ShortListResponse } from './dto/short-list.respose';

@Controller('/api')
export class ShortsController {
  constructor(private readonly shortsService: ShortsService) {}

  @Post('shorten')
  @ApiBody({ type: CreateShortRequest })
  @ApiOperation({ summary: 'Create shorter url' })
  async createShort(
    @Body() createShortDto: CreateShortRequest,
  ): Promise<ShortResponse> {
    return ShortResponse.of(
      await this.shortsService.createShort(createShortDto),
    );
  }

  @Get('find-shorts-of/:userId')
  @ApiOperation({ summary: 'Get short urls created by yser' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiParam({
    name: 'userId',
    required: true,
    type: String,
    example: '99fec7f7-daaf-43e2-9ae7-011d4033e239',
    description: 'Owner database id',
  })
  async findShortsOfUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ShortListResponse> {
    const currentPage = page ? Number(page) : 1;
    const perPage = limit ? Number(limit) : 10;
    return await this.shortsService.findShortsOfUser(
      userId,
      currentPage,
      perPage,
    );
  }

  @Patch('update-short/:id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Shorter url database id',
    example: '99fec7f7-daaf-43e2-9ae7-011d4033e239',
  })
  @ApiOperation({ summary: 'Update shorter url' })
  async updateShortcut(
    @Param('id') id: string,
    @Body() updateShortDto: UpdateShortRequest,
  ): Promise<ShortResponse> {
    return ShortResponse.of(
      await this.shortsService.updateShort(id, updateShortDto),
    );
  }
}
