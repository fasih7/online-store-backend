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
