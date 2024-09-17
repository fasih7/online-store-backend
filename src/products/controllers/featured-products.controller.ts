import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { FeaturedProductsService } from '../services/featured-products.service';
import { UpdateFeaturedProductDto } from '../dto/udpate-featured-products.dto';

@Controller('featured-products')
export class FeaturedProductsController {
  constructor(private featuredProductService: FeaturedProductsService) {}

  @Get()
  getFeaturedProducts() {
    return this.featuredProductService.getAllFeaturedProducts();
  }

  @Post()
  addFeaturedProduct(@Body('product') featuredProduct: any) {
    console.log(featuredProduct);

    return this.featuredProductService.createFeatureProduct(featuredProduct);
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
