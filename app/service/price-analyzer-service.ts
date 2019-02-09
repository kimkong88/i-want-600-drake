import { NotificationService } from './notification-service';

export class PriceAnalyzerService {
    notificationService: NotificationService;
    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    analyzePrice(cachedPrice: any) {
        const prev = cachedPrice.previous;
        let curr = cachedPrice.current;

        if (curr === undefined) {
            curr = prev;
        }

        if (prev.length > curr.length) {
            this.notificationService.sendMail({
                text: 'Something may have been de-listed!'
            });
        }

        if (prev.length < curr.length) {
            this.notificationService.sendMail({
                text: 'A new listing has been detected!'
            });
        }

        if (prev.length === curr.length) {
            prev.forEach((array: number[], i: number) => {
                array.forEach((price: number, j: number) => {
                    if (price !== curr[i][j]) {
                        this.notificationService.sendMail({
                            text: 'A change in price has been detected!'
                        });
                    }
                });
            });
        }
    }
}