import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  addressLine: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  province: string;

  @Column({ type: 'varchar', length: 20 })
  postalCode: string;

  @Column({ type: 'varchar', length: 50 })
  label: string; // e.g. 'home', 'work'

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;
}
