import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryPostgresRepo } from './repos/category.postgres.repo';
import { CategoryFileUploadService } from './services/category-file-upload.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AdminAuthGuard } from '../auth/gaurds/auth.gaurd';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: MongoCategory.name, schema: CategorySchema },
    // ]),
    TypeOrmModule.forFeature([Category]),
    AuthModule,
    UserModule,
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    /* CategoryRepo, */
    CategoryPostgresRepo,
    CategoryFileUploadService,
    AdminAuthGuard,
  ],
})
export class CategoriesModule {}
