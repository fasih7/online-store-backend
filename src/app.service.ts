import { BadRequestException, Injectable } from '@nestjs/common';
import { LoggerService } from './global/logger';

@Injectable()
export class AppService {
  constructor(private logger: LoggerService) {}
  getHello(): string {
    this.logger.silly(AppService.name, this.getHello.name, 'started');
    return 'Hello World!';
  }

  getTest() {
    throw new Error('hello');
  }
}
