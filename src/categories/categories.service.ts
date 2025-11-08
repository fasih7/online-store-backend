import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { CategoryRepo } from './repos/category.mongo.repo';
import { CategoryPostgresRepo } from './repos/category.postgres.repo';
import { CategoryFileUploadService } from './services/category-file-upload.service';
import { SuccessResponse } from '../global/consts';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepo: CategoryPostgresRepo,
    private readonly fileUploadService: CategoryFileUploadService,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDto,
    files?: {
      image?: Express.Multer.File[];
    },
  ) {
    const { parentCategory, ...categoryData } = createCategoryDto;

    // Process uploaded file - image is ONLY from file uploads now
    let imagePath: string | undefined;

    if (files?.image && files.image.length > 0) {
      const imagePaths = await this.fileUploadService.saveFiles(files.image);
      imagePath = imagePaths[0];
    }

    // Image is required - must be uploaded as file
    if (!imagePath) {
      throw new BadRequestException(
        'Image is required. Please upload an image file.',
      );
    }

    return await this.categoryRepo.create({
      ...categoryData,
      image: imagePath,
      parentCategoryId: parentCategory, // Map parentCategory string to parentCategoryId
    });
  }

  async findAll() {
    return await this.categoryRepo.findMany();
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepo.findBySlug(slug);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    files?: {
      image?: Express.Multer.File[];
    },
  ) {
    // Fetch existing category
    const existingCategory = await this.categoryRepo.findOneById(id);
    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    const { imageToRemove, ...updateData } = updateCategoryDto;

    // Process new uploaded file
    let newImagePath: string | undefined;

    if (files?.image && files.image.length > 0) {
      const imagePaths = await this.fileUploadService.saveFiles(files.image);
      newImagePath = imagePaths[0];
    }

    // Handle image removal
    // If imageToRemove is explicitly provided, use it
    // If not provided but new image is uploaded, automatically remove the previous image
    let imageToDelete: string | undefined;
    if (imageToRemove) {
      imageToDelete = imageToRemove;
    } else if (newImagePath && existingCategory.image) {
      // New image uploaded but imageToRemove not specified - auto-delete previous image
      imageToDelete = existingCategory.image;
    }

    if (imageToDelete) {
      await this.fileUploadService.deleteFile(imageToDelete);
    }

    // Prepare update data
    const { parentCategory, ...restUpdateData } = updateData;
    const finalUpdateData = {
      ...restUpdateData,
      // Use new image if uploaded, otherwise keep existing
      image: newImagePath || existingCategory.image,
      // Map parentCategory to parentCategoryId if provided
      ...(parentCategory && { parentCategoryId: parentCategory }),
    };

    await this.categoryRepo.updateOneById(id, finalUpdateData);
    return SuccessResponse;
  }

  async remove(id: string) {
    // Fetch category to get associated image
    const category = await this.categoryRepo.findOneById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Delete associated image file
    if (category.image) {
      await this.fileUploadService.deleteFile(category.image);
    }

    // Delete category from database
    await this.categoryRepo.deleteOneById(id);
    return SuccessResponse;
  }
}
