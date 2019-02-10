import { NotificationService } from './notification-service';

export class PriceAnalyzerService {
    private notificationService: NotificationService;
    private _isFirstRun: boolean = false;

    constructor(notificationService: NotificationService) {
        this.notificationService = notificationService;
    }

    get isFirstRun() {
        return this._isFirstRun;
    }

    set isFirstRun(isFirstRun: boolean) {
        this._isFirstRun = isFirstRun;
    }

    analyzePrice(cachedPrice: any) {
        let prev: [] = cachedPrice.previous;
        let curr: [] = cachedPrice.current;

        prev = prev.sort();
        curr = curr.sort();

        if (!this.isFirstRun) {
            this.isFirstRun = true;
            return;
        }

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