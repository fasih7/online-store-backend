import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Role } from '../../global/enums';
import { Status } from '../utils/enums';
import { Product } from '../../products/entities/product.entity';
import { Order } from '../../orders/entities';
import { Address } from './address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  // Token as JSON column for PostgreSQL
  @Column({ type: 'jsonb', nullable: true })
  token: {
    value: string;
    expiration: string;
    tries: number;
  };

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.pending,
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({ type: 'text', nullable: true })
  hashedRt?: string | null;

  @Column({ type: 'boolean', default: false })
  isGuest: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
