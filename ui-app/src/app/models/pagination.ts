export interface IPagination {
  currentPage: number;
  itemPerPage: number;
  totalItems: number;
  totalPages: number;
}

export class PaginationResult<T> {
  data: T;
  pagination: IPagination;
  constructor(data: T, pagination: IPagination) {
    this.data = data;
    this.pagination = pagination;
  }
}

export class PagingParams {
  pageNumber: number;
  pageSize: number;
  /**
   *
   */
  constructor() {
    this.pageNumber = 1;
    this.pageSize = 10;
  }
}
