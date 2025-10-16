import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryPostgresRepo } from './repos/category.postgres.repo';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: MongoCategory.name, schema: CategorySchema },
    // ]),
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, /* CategoryRepo, */ CategoryPostgresRepo],
})
export class CategoriesModule {}
