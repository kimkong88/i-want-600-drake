import express from 'express';
import dotenv from 'dotenv';
import { CrawlingService } from './service/crawling-service';
import { SchedulerService } from './service/scheduler-service';
import { constant } from './const/constant';
import { NotificationService } from './service/notification-service';
import { PriceAnalyzerService } from './service/price-analyzer-service';

export class Application {
	app: express.Application;

	notificationService: NotificationService;
	crawingService: CrawlingService;
	schedulerService: SchedulerService;
	priceAnalyzerService: PriceAnalyzerService;

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
		let priceArray: number[] = [];

		priceArray = this.recordPrice(priceArray);
		this.schedulerService.runJob(constant.cronEveryTenMinutes, () => {
			priceArray = this.recordPrice(priceArray);
		});
	}

	private recordPrice(priceArray: number[]): number[] {
		this.cachedPrice.previous = this.cachedPrice.current;
		priceArray = this.crawingService.crawlWithUrl(constant.url);

		this.cachedPrice.current = priceArray;

		this.crawingService.emptyPriceArray();

		this.priceAnalyzerService.analyzePrice(this.cachedPrice);

		return priceArray;
	}
}

try {
	dotenv.config();
	const app = new Application();
	app.run();

	console.log(`Running on port ${app.port}`)
} catch (e) {
	// log error
}

