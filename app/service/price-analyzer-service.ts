import { NotificationService } from './notification-service';

export class PriceAnalyzerService {
    notificationService: NotificationService;
    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    analyzePrice(cachedPrice: any) {
        let prev: [] = cachedPrice.previous;
        let curr: [] = cachedPrice.current;

        prev = prev.sort();
        curr = curr.sort();

        if (curr === undefined) {
            curr = prev;
        }

        if (prev.length > curr.length) {
            this.notificationService.sendMail({
                text: 'Something may have been de-listed!'
            });
            return;
        }

        if (prev.length < curr.length) {
            this.notificationService.sendMail({
                text: 'A new listing has been detected!'
            });
            return;
        }

        if (prev.length === curr.length) {
            prev.forEach((prevPrice: number, i: number) => {
                if (prevPrice !== curr[i]) {
                    this.notificationService.sendMail({
                        text: 'Change in price detected!'
                    });
                    return;
                }
            });
        }
        return;
    }
}