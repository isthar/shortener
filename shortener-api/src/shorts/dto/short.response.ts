import { Short } from '../entities/short.entity';
import { ApiData } from './data';

export class ShortResponse {
  static of(short: Short): ShortResponse {
    return new ShortResponse(short.id, short.slug, short.url, short.ownerId);
  }

  data: ApiData;
  constructor(id: string, slug: string, url: string, ownerId: string) {
    this.data = new ApiData('shorts', id, {
      slug,
      url,
      ownerId,
    });
  }
}
