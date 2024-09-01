import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { Module } from '@nestjs/common';

const transports = {
  console: function (serviceName: string) {
    return new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        nestWinstonModuleUtilities.format.nestLike(serviceName),
      ),
    });
  },
  File: function (serviceName: string) {
    return new winston.transports.File({
      level: 'silly',
      filename: `${serviceName}.log`,
    });
  },
};

//TODO: Enhancement, need the service name configured for logger
//TODO: Check call stack and get name from there
export class LoggerService {
  public readonly log_data: any;
  public readonly logger: any;

  //TODO: Move this to common package for micro service implementations
  private serviceName = 'Service Name';

  constructor() { // private readonly serviceName: string
    this.log_data = null;
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD/MM/YYYY HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),

      transports: [
        transports.console(this.serviceName),
        transports.File(this.serviceName),
      ],
    });
  }

  async info(
    className: string,
    functionName: string,
    message: string,
    obj?: any,
  ) {
    let data = this.formatLogData(className, functionName, message);
    this.logger.log('info', data, obj);
  }

  async debug(
    className: string,
    functionName: string,
    message: string,
    obj?: any,
  ) {
    let data = this.formatLogData(className, functionName, message);
    this.logger.log('debug', data, obj);
  }
  async error(
    className: string,
    functionName: string,
    message: string,
    obj?: any,
  ) {
    let data = this.formatLogData(className, functionName, message);
    this.logger.log('error', data, this.checkLogObject(obj));
  }

  async warn(
    className: string,
    functionName: string,
    message: string,
    obj?: any,
  ) {
    let data = this.formatLogData(className, functionName, message);
    this.logger.log('warn', data, obj);
  }

  async silly(
    className: string,
    functionName: string,
    message: string,
    obj?: any,
  ) {
    let data = this.formatLogData(className, functionName, message);
    this.logger.log('silly', data, obj);
  }

  formatLogData = (
    className: string,
    functionName: string,
    message: string,
  ) => {
    message = functionName + '()' + ' | ' + message;
    message = ' | ' + className + ' | ' + message;
    return message;
  };

  checkLogObject = (obj: any) => {
    if (obj) {
      return typeof obj === 'object' ? obj : { error: obj };
    }
  };
}

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
