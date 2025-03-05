import { Short } from '../entities/short.entity';

export class ShortsResponse {
  data: Short[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };

  constructor(
    data: Short[],
    meta: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    },
  ) {
    this.data = data;
    this.meta = meta;
  }
}
