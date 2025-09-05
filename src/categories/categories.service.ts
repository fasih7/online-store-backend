import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepo } from './repos/category.repo';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepo: CategoryRepo) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryRepo.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepo.findMany();
  }

  async findOneBySlug(slug: string) {
    return await this.categoryRepo.findOne({ query: { slug } });
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
