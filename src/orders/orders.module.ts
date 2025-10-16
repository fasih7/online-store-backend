import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order as MongoOrder, OrderSchema } from './schemas/order.schema';
import { OrderRepo } from './repos/order.mongo.repo';
import { EmailService } from 'src/notifications/services/email.service';
import { UserModule } from 'src/user/user.module';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderPostgresRepo } from './repos/order.postgres.repo';
import { OrderItemPostgresRepo } from './repos/order-item.postgres.repo';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: MongoOrder.name, schema: OrderSchema }]),
    TypeOrmModule.forFeature([Order, OrderItem]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    /* OrderRepo, */
    EmailService,
    OrderPostgresRepo,
    OrderItemPostgresRepo,
  ],
})
export class OrdersModule {}
