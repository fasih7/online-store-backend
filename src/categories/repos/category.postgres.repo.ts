import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { IPostgresRepoBase } from '../../global/repo/postgres-repo-impl';

@Injectable()
export class CategoryPostgresRepo extends IPostgresRepoBase<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository);
  }

  /**
   * Find all main categories (no parent)
   */
  async findMainCategories(): Promise<Category[]> {
    return await this.findMany({
      where: { parentCategoryId: null },
      relations: ['subCategories'],
    });
  }

  /**
   * Find subcategories by parent ID
   */
  async findSubCategories(parentId: string): Promise<Category[]> {
    return await this.findMany({
      where: { parentCategoryId: parentId },
      relations: ['subCategories'],
    });
  }

  /**
   * Find category with all relations
   */
  async findWithAllRelations(categoryId: string): Promise<Category | null> {
    return await this.findOneById(categoryId, [
      'parentCategory',
      'subCategories',
      'products',
    ]);
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    return await this.findOne({
      where: { slug },
      relations: ['subCategories', 'products'],
    });
  }

  /**
   * Find category by name
   */
  async findByName(name: string): Promise<Category | null> {
    return await this.findOne({
      where: { name },
    });
  }

  /**
   * Get category hierarchy (parent with all subcategories)
   */
  async getCategoryHierarchy(): Promise<Category[]> {
    return await this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subCategories', 'subCategories')
      .leftJoinAndSelect('subCategories.subCategories', 'subSubCategories')
      .where('category.parentCategoryId IS NULL')
      .getMany();
  }

  /**
   * Get categories with product count
   */
  async getCategoriesWithProductCount(): Promise<any[]> {
    return await this.repository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'products')
      .select([
        'category.id',
        'category.name',
        'category.slug',
        'category.image',
      ])
      .addSelect('COUNT(products.id)', 'productCount')
      .groupBy('category.id')
      .getRawMany();
  }

  /**
   * Search categories by name
   */
  async searchByName(searchTerm: string): Promise<Category[]> {
    return await this.repository
      .createQueryBuilder('category')
      .where('category.name ILIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }

  /**
   * Get full category path (from root to current category)
   */
  async getCategoryPath(categoryId: string): Promise<Category[]> {
    const category = await this.findOneById(categoryId, ['parentCategory']);
    const path: Category[] = [category];

    let currentCategory = category;
    while (currentCategory.parentCategory) {
      currentCategory = await this.findOneById(
        currentCategory.parentCategory.id,
        ['parentCategory'],
      );
      path.unshift(currentCategory);
    }

    return path;
  }
}
