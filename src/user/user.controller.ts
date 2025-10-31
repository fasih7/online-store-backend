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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard, AdminAuthGuard } from 'src/auth/gaurds/auth.gaurd';
import { ApiTags } from '@nestjs/swagger';
import { Address } from './entities/address.entity';
import { GetAllUsersQueryDto } from './dto/get-all-users-query.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async findAll(@Req() request: Record<string, any>) {
    return this.userService.findOneById(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async updateUser(
    @Req() request: Record<string, any>,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id: userId, email } = request.user;
    if (email !== updateUserDto.email)
      throw new BadRequestException('Email cannot be changed');

    return this.userService.findOneAndUpdate(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('address')
  async createAddress(
    @Req() request: Record<string, any>,
    @Body() addressData: Partial<Address>,
  ) {
    const userId = request.user.id;
    return this.userService.addAddress(userId, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('address')
  async getAddresses(@Req() request: Record<string, any>) {
    const userId = request.user.id;
    return this.userService.findAddressesByCondition({ user: { id: userId } });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('address')
  async updateAddress(
    @Req() request: Record<string, any>,
    @Body() addressData: Partial<Address>,
  ) {
    const userId = request.user.id;
    return this.userService.updateAddress(userId, addressData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('address/:id')
  async deleteAddress(
    @Param('id') addressId: string,
    @Req() request: Record<string, any>,
  ) {
    const userId = request.user.id;
    return this.userService.deleteAddress(addressId, userId);
  }

  @UseGuards(AdminAuthGuard)
  @Get('all')
  async getAllUsers(@Query() query: GetAllUsersQueryDto) {
    // Normalize sortOrder: Transform -1 to DESC, default to ASC
    if (query.sortOrder === '-1') {
      query.sortOrder = 'DESC';
    } else if (!query.sortOrder) {
      query.sortOrder = 'ASC';
    }
    return this.userService.getAllUsers(query);
  }

  @UseGuards(AdminAuthGuard)
  @Patch(':id/status')
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.userService.updateUserStatus(
      userId,
      updateUserStatusDto.status,
    );
  }
}
