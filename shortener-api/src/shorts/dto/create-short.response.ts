import { Short } from '../entities/short.entity';
import { ApiData } from './data';

export class CreateShortResponse {
  static of(short: Short): CreateShortResponse {
    return new CreateShortResponse(
      short.id,
      short.slug,
      short.url,
      short.ownerId,
    );
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
