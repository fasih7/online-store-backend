import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductRepo } from '../repo/product.repo';
import { SuccessResponse } from '../../global/consts';
import { GetManyProductsQuery } from '../dto/get-many-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepo: ProductRepo) {}

  async createProduct(createProduct: CreateProductDto, user: any) {
    const dtoWithUserId = { ...createProduct, userId: user.sub };
    await this.productRepo.create(dtoWithUserId);
    return SuccessResponse;
  }

  async getProducts(
    productQuery: GetManyProductsQuery,
    getPagination?: boolean,
  ) {
    const { category: commaSeparedCategories, ...restQuery } = productQuery;

    // Logic for category if category is not provided should not pass then
    const category = commaSeparedCategories?.split(',');
    const query = {
      ...(category?.length &&
        category[0] !== '' && { category: { $in: category } }),
    };

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

  async getProductById(_id: string) {
    return await this.productRepo.findOneById(_id);
  }
}
