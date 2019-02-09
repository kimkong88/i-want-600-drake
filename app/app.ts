import express from 'express';
import dotenv from 'dotenv';
import { CrawlingService } from './service/crawling-service';
import { SchedulerService } from './service/scheduler-service';
import { constant } from './const/constant';
import { NotificationService } from './service/notification-service';
import { PriceAnalyzerService } from './service/price-analyzer-service';

export class Application {
  app: express.Application;

  notificationService: NotificationService = new NotificationService();
  crawingService: CrawlingService = new CrawlingService();
  schedulerService: SchedulerService = new SchedulerService();
  priceAnalyzerService: PriceAnalyzerService = new PriceAnalyzerService(this.notificationService);

  port = process.env.PORT || 8081;
  cachedPrice: any = {
    previous: [],
    current: []
  }

  constructor() {
    this.app = express();
    this.app.listen(this.port);
    this.notificationService = new NotificationService();
    this.crawingService = new CrawlingService();
    this.schedulerService = new SchedulerService();
    this.priceAnalyzerService = new PriceAnalyzerService(this.notificationService);
  }

  run() {
    this.schedulerService.runJob(constant.cron, () => {
      this.cachedPrice.previous = this.cachedPrice.current;
      const priceArray = this.crawingService.crawlWithUrl(constant.url);
      this.cachedPrice.current = priceArray;

      this.priceAnalyzerService.analyzePrice(this.cachedPrice);
    });
  }
}

try {
  dotenv.config();
  const app = new Application();
  app.run();

  console.log(`Running on port ${app.port}`)
} catch(e) {
  // log error
}

