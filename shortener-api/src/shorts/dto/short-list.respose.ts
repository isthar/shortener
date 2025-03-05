import { Short } from '../entities/short.entity';

export class ShortListResponse {
  data: {
    id: string;
    slug: string;
    url: string;
    ownerId: string;
    shortUrl: string;
  }[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };

  constructor(
    indata: Short[],
    meta: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    },
  ) {
    this.data = indata.map((short: Short) => ({
      id: short.id,
      slug: short.slug,
      url: short.url,
      ownerId: short.ownerId,
      shortUrl: `${process.env.URL_HOSTNAME}/${short.slug}`,
    }));
    this.meta = meta;
  }
}
