import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from './global/logger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private log: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.log.silly(AppController.name, this.getHello.name, 'started');
    return this.appService.getHello();
  }

  @Get('test/:id')
  getTest() {
    throw new BadRequestException('very bad request');
    return this.appService.getTest();
  }
}
