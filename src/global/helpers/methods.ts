export function getPaginationObject(
  pageNumber: number,
  limit: number,
  totalRecords: number,
) {
  const totalPages = Math.ceil(totalRecords / limit);
  const hasPrevPage = pageNumber > 1;
  const hasNextPage = pageNumber < totalPages;

  return {
    pageNumber,
    limit,
    totalRecords,
    totalPages,
    hasPrevPage,
    hasNextPage,
  };
}

export function getPostgresPaginationObject(
  currentPage: number,
  itemsPerPage: number,
  totalItems: number,
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
  };
}
