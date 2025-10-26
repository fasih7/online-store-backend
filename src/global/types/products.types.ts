export interface Product {
  id: string;
  title: string;
  description: string;
  quantity: number;
  price: string;
  images: string[];
  primaryImage: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsResponse {
  pagination: Pagination;
  data: Product[];
}
