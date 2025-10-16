import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { ApiTags } from '@nestjs/swagger';
import { Address } from './entities/address.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async findAll(@Req() request: Record<string, any>) {
    console.log('request: ', request.user);

    return this.userService.findOneById(request.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(
    @Req() request: Record<string, any>,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = request.user.sub;
    return this.userService.findOneAndUpdate(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  async createAddress(
    @Req() request: Record<string, any>,
    @Body() addressData: Partial<Address>,
  ) {
    const userId = request.user.sub;
    return this.userService.addAddress(userId, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('address')
  async getAddresses(@Req() request: Record<string, any>) {
    const userId = request.user.sub;
    return this.userService.findAddressesByCondition({ user: { id: userId } });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('address')
  async updateAddress(
    @Req() request: Record<string, any>,
    @Body() addressData: Partial<Address>,
  ) {
    const userId = request.user.sub;
    return this.userService.updateAddress(userId, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('address/:id')
  async deleteAddress(
    @Param('id') addressId: string,
    @Req() request: Record<string, any>,
  ) {
    const userId = request.user.sub;
    return this.userService.deleteAddress(addressId, userId);
  }
}
