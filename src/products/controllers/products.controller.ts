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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { AdminAuthGuard } from '../../auth/gaurds/auth.gaurd';
import { RolesGuard } from '../../auth/role/role.guard';
import { Role } from '../../global/enums';
import { Roles } from '../../auth/roles/roles.decorator';
import { GetManyProductsQuery } from '../dto/get-many-products-query.dto';
import { SearchProductsDto } from '../dto/search-products.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'primaryImage', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  @Post('')
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      primaryImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
    @Request() req,
  ) {
    return await this.productsService.createProduct(
      createProductDto,
      req.user,
      files,
    );
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

  @Get('search')
  async searchProducts(@Query() searchQuery: SearchProductsDto) {
    return await this.productsService.searchProducts(searchQuery);
  }

  @UseGuards(AdminAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'primaryImage', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  @Put('/:id')
  async updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      primaryImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    return await this.productsService.updateProduct(
      id,
      updateProductDto,
      files,
    );
  }

  @UseGuards(AdminAuthGuard)
  @Delete('/:id')
  async deleteProductById(@Param('id') id: string) {
    return await this.productsService.deleteProduct(id);
  }
}
