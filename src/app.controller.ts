import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Get()
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  startSpider() {
    this.logger.verbose('Starting spider');
    return this.appService.startSpider();
  }

  @Get('list')
  list() {
    return this.appService.list();
  }
}
