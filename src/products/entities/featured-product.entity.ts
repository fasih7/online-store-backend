import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('featured_products')
export class FeaturedProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: 'featured_product_items',
    joinColumn: {
      name: 'featuredProductId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'productId',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
