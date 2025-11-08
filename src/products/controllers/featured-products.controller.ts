import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { FeaturedProductsService } from '../services/featured-products.service';
import { UpdateFeaturedProductDto } from '../dto/udpate-featured-products.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Featured Products')
@Controller('featured-products')
export class FeaturedProductsController {
  constructor(
    private readonly featuredProductService: FeaturedProductsService,
  ) {}

  @Get()
  getFeaturedProducts() {
    return this.featuredProductService.getAllFeaturedProducts();
  }

  @Post()
  addFeaturedProduct(@Body('productIds') productIds: string[]) {
    return this.featuredProductService.createFeatureProduct(productIds);
  }

  @Put('/:_id')
  updateFeaturedProductList(
    @Body() updateFeaturedProductDto: UpdateFeaturedProductDto,
  ) {
    return this.featuredProductService.updateFeaturedProducts(
      updateFeaturedProductDto,
    );
  }
}
