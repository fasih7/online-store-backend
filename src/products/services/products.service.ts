import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
// import { ProductRepo } from '../repo/product.mongo.repo';
import { ProductPostgresRepo } from '../repo/product.postgres.repo';
import { SuccessResponse } from '../../global/consts';
import { GetManyProductsQuery } from '../dto/get-many-products-query.dto';
import { SearchProductsDto } from '../dto/search-products.dto';
import { FileUploadService } from './file-upload.service';
import { Product } from '../entities';
import { PostgresPaginatedResponse } from '../../global/types/postgres.types';
import { getPostgresPaginationObject } from '../../global/helpers/methods';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepo: ProductPostgresRepo,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createProduct(
    createProduct: CreateProductDto,
    user: any,
    files?: {
      primaryImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    const { category, ...productData } = createProduct;

    // Process uploaded files - images are ONLY from file uploads now
    let primaryImagePath: string | undefined;
    let additionalImagePaths: string[] = [];

    if (files?.primaryImage && files.primaryImage.length > 0) {
      const primaryImagePaths = await this.fileUploadService.saveFiles(
        files.primaryImage,
      );
      primaryImagePath = primaryImagePaths[0];
    }

    if (files?.images && files.images.length > 0) {
      additionalImagePaths = await this.fileUploadService.saveFiles(
        files.images,
      );
    }

    // Primary image is required - must be uploaded as file
    if (!primaryImagePath) {
      throw new BadRequestException(
        'Primary image is required. Please upload a primary image file.',
      );
    }

    const productToCreate = {
      ...productData,
      primaryImage: primaryImagePath,
      images: additionalImagePaths,
      userId: user.id,
      categoryId: category, // Map category to categoryId
    };
    await this.productRepo.create(productToCreate);
    return SuccessResponse;
  }

  async getProducts(
    productQuery: GetManyProductsQuery,
    getPagination?: boolean,
  ): Promise<PostgresPaginatedResponse<Product>> {
    const { category: commaSeparedCategories, ...restQuery } = productQuery;

    // Logic for category if category is not provided should not pass then
    const categoryIds = commaSeparedCategories?.split(',');
    const query = {
      ...(categoryIds?.length &&
        categoryIds[0] !== '' && { categoryId: categoryIds }), // PostgreSQL uses IN for array matching
    };

    let { pageNumber = 1, limit = 12, searchQuery } = restQuery;

    let productsResult: Product[] = [];

    if (searchQuery) {
      productsResult = await this.productRepo.searchProductsV2(searchQuery, {
        pageNumber,
        limit,
        categoryIds,
        ...restQuery,
      });
    } else {
      productsResult = await this.productRepo.createQueryAndFindMany({
        query,
        options: { pagination: { pageNumber, limit }, ...restQuery },
      });
    }

    pageNumber = +pageNumber;
    limit = +limit;

    const pagination = getPostgresPaginationObject(
      pageNumber,
      limit,
      productsResult.length,
    );

    return { pagination, data: productsResult };
  }

  async getProductById(id: string) {
    return await this.productRepo.findOneById(id);
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    files?: {
      primaryImage?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ) {
    // Fetch existing product
    const existingProduct = await this.productRepo.findOneById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const { imagesToRemove, ...updateData } = updateProductDto;

    // Process new uploaded files
    let newPrimaryImagePath: string | undefined;
    let newImagePaths: string[] = [];

    if (files?.primaryImage && files.primaryImage.length > 0) {
      const primaryImagePaths = await this.fileUploadService.saveFiles(
        files.primaryImage,
      );
      newPrimaryImagePath = primaryImagePaths[0];
    }

    if (files?.images && files.images.length > 0) {
      newImagePaths = await this.fileUploadService.saveFiles(files.images);
    }

    // Handle image removal
    if (imagesToRemove && imagesToRemove.length > 0) {
      await this.fileUploadService.deleteMultipleFiles(imagesToRemove);
    }

    // Update images array
    let updatedImages = [...existingProduct.images];

    // Remove specified images
    if (imagesToRemove && imagesToRemove.length > 0) {
      updatedImages = updatedImages.filter(
        (img) => !imagesToRemove.includes(img),
      );
    }

    // Add new images
    updatedImages = [...updatedImages, ...newImagePaths];

    // Prepare update data
    const { category, ...restUpdateData } = updateData;
    const finalUpdateData = {
      ...restUpdateData,
      images: updatedImages,
      // Use new primary image if uploaded, otherwise keep existing
      primaryImage: newPrimaryImagePath || existingProduct.primaryImage,
      // Map category to categoryId if provided
      ...(category && { categoryId: category }),
    };

    await this.productRepo.updateOneById(id, finalUpdateData);
    return SuccessResponse;
  }

  async deleteProduct(id: string) {
    // Fetch product to get associated images
    const product = await this.productRepo.findOneById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete all associated image files (including primary image)
    const allImages = [product.primaryImage, ...(product.images || [])].filter(
      Boolean,
    );
    if (allImages.length > 0) {
      await this.fileUploadService.deleteFilesFromProduct(allImages);
    }

    // Delete product from database
    await this.productRepo.deleteOneById(id);
    return SuccessResponse;
  }

  async searchProducts(searchQueryDto: SearchProductsDto) {
    const { searchQuery } = searchQueryDto;

    // Parse category IDs if provided
    // const categoryIds = category?.split(',').filter((id) => id.trim() !== '');

    const searchOptions = {
      limit: 8,
      // ...restQuery,
      // categoryIds,
    };

    return await this.productRepo.searchProductsV2(searchQuery, searchOptions);
  }
}
