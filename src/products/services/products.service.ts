import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
// import { ProductRepo } from '../repo/product.mongo.repo';
import { ProductPostgresRepo } from '../repo/product.postgres.repo';
import { SuccessResponse } from '../../global/consts';
import { GetManyProductsQuery } from '../dto/get-many-products-query.dto';
import { SearchProductsDto } from '../dto/search-products.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepo: ProductPostgresRepo) {}

  async createProduct(createProduct: CreateProductDto, user: any) {
    const { category, quantity, ...productData } = createProduct;
    const productToCreate = {
      ...productData,
      userId: user.sub,
      categoryId: category, // Map category to categoryId
    };
    await this.productRepo.create(productToCreate);
    return SuccessResponse;
  }

  async getProducts(
    productQuery: GetManyProductsQuery,
    getPagination?: boolean,
  ) {
    const { category: commaSeparedCategories, ...restQuery } = productQuery;

    // Logic for category if category is not provided should not pass then
    const categoryIds = commaSeparedCategories?.split(',');
    const query = {
      ...(categoryIds?.length &&
        categoryIds[0] !== '' && { categoryId: categoryIds }), // PostgreSQL uses IN for array matching
    };

    console.log({ query });

    let { pageNumber = 1, limit = 12 } = restQuery;
    pageNumber = +pageNumber;
    limit = +limit;
    return await this.productRepo.createQueryAndFindMany(
      {
        query,
        options: { pagination: { pageNumber, limit }, ...restQuery },
      },
      getPagination,
    );
  }

  async getProductById(id: string) {
    return await this.productRepo.findOneById(id);
  }

  async searchProducts(searchQuery: SearchProductsDto) {
    const { searchTerm, category, ...restQuery } = searchQuery;

    // Parse category IDs if provided
    const categoryIds = category?.split(',').filter((id) => id.trim() !== '');

    const searchOptions = {
      ...restQuery,
      categoryIds,
    };

    return await this.productRepo.searchProductsV2(searchTerm, searchOptions);
  }
}
