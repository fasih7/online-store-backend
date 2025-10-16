import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  // Self-referencing relationship for parent category
  @Column({ type: 'uuid', nullable: true })
  parentCategoryId: string;

  @ManyToOne(() => Category, (category) => category.subCategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory: Category | null;

  @OneToMany(() => Category, (category) => category.parentCategory)
  subCategories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
