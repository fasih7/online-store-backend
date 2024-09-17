import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductRepo } from '../repo/product.repo';
import { SuccessResponse } from '../../global/consts';
import { GetManyProductsQuery } from '../dto/get-many-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(private productRepo: ProductRepo) {}

  async createProduct(createProduct: CreateProductDto, user: any) {
    const dtoWithUserId = { ...createProduct, userId: user.sub };
    await this.productRepo.create(dtoWithUserId);
    return SuccessResponse;
  }

  async getProducts(
    productQuery: GetManyProductsQuery,
    getPagination?: boolean,
  ) {
    let { pageNumber, limit } = productQuery;
    pageNumber = +pageNumber;
    limit = +limit;
    return await this.productRepo.createQueryAndFindMany(
      {
        options: { pagination: { pageNumber, limit }, ...productQuery },
      },
      getPagination,
    );
  }

  async getProductById(_id: string) {
    return await this.productRepo.findOneById(_id);
  }
}
