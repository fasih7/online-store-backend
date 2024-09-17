import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Request,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { JwtAuthGuard } from '../../auth/gaurds/auth.gaurd';
import { RolesGuard } from '../../auth/role/role.guard';
import { Role } from '../../global/enums';
import { Roles } from '../../auth/roles/roles.decorator';
import { GetManyProductsQuery } from '../dto/get-many-products-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.client)
  @Post('')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
  ) {
    return await this.productsService.createProduct(createProductDto, req.user);
  }

  @Get('')
  async getProducts(@Query() productQuery: GetManyProductsQuery) {
    return await this.productsService.getProducts(productQuery);
  }

  @Get('recently-added')
  async getRecentlyAddedProducts() {
    const queryParams = {
      pageNumber: 1,
      limit: 4,
      sortBy: 'createdAt',
      sortOrder: '-1',
    };
    return await this.productsService.getProducts(queryParams, false);
  }

  @Get('product/:id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.client)
  @Put('/:id')
  async updateProductById(@Param('id') id: string) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.client)
  @Delete('/:id')
  async deleteProductById(@Param('id') id: string) {}
}
