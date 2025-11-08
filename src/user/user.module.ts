import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Address } from './entities/address.entity';
import { LoggerModule } from '../global/logger';
import { UserPostgresRepo } from './repos/user.postgres.repo';
import { AddressRepo } from './repos/address.repo';
import { Order } from '../orders/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address, Order]), LoggerModule],
  controllers: [UserController],
  providers: [UserService, UserPostgresRepo, AddressRepo],
  exports: [UserService],
})
export class UserModule {}
