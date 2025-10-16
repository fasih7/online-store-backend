import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PostgresBaseDataAccess } from '../../global/data/postgresBaseDataAccess';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressRepo extends PostgresBaseDataAccess<Address> {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(addressRepository);
  }
}
