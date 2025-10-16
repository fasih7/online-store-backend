import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { CategoryRepo } from './repos/category.mongo.repo';
import { CategoryPostgresRepo } from './repos/category.postgres.repo';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepo: CategoryPostgresRepo) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { parentCategory, ...categoryData } = createCategoryDto;
    return await this.categoryRepo.create({
      ...categoryData,
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

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
