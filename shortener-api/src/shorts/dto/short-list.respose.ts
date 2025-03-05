import { Short } from '../entities/short.entity';

export class ShortListResponse {
  data: {
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
      slug: short.slug,
      url: short.url,
      ownerId: short.ownerId,
      shortUrl: `${process.env.URL_HOSTNAME}/${short.slug}`,
    }));
    this.meta = meta;
  }
}
