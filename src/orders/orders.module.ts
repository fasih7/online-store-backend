import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderRepo } from './repos/order.repo';
import { EmailService } from 'src/notifications/services/email.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UserModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrderRepo, EmailService],
})
export class OrdersModule {}
