import {
  Controller,
  Get,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async startSpider() {
    this.logger.verbose('Starting spider');
    const res = await this.appService.startSpider();
    this.logger.verbose('Spider finished');
    return res;
  }

  @Get('list')
  list() {
    return this.appService.list();
  }

  onApplicationBootstrap() {
    this.logger.verbose('App started');
    this.startSpider();
  }
}
