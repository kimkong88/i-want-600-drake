"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var crawling_service_1 = require("./service/crawling-service");
var scheduler_service_1 = require("./service/scheduler-service");
var constant_1 = require("./const/constant");
var notification_service_1 = require("./service/notification-service");
var price_analyzer_service_1 = require("./service/price-analyzer-service");
var Application = /** @class */ (function () {
    function Application() {
        this.notificationService = new notification_service_1.NotificationService();
        this.crawingService = new crawling_service_1.CrawlingService();
        this.schedulerService = new scheduler_service_1.SchedulerService();
        this.priceAnalyzerService = new price_analyzer_service_1.PriceAnalyzerService(this.notificationService);
        this.port = process.env.port || 8081;
        this.cachedPrice = {
            previous: [],
            current: []
        };
        this.app = express_1.default();
        this.app.listen(this.port);
        this.notificationService = new notification_service_1.NotificationService();
        this.crawingService = new crawling_service_1.CrawlingService();
        this.schedulerService = new scheduler_service_1.SchedulerService();
        this.priceAnalyzerService = new price_analyzer_service_1.PriceAnalyzerService(this.notificationService);
    }
    Application.prototype.run = function () {
        var _this = this;
        this.schedulerService.runJob(constant_1.constant.cron, function () {
            _this.cachedPrice.previous = _this.cachedPrice.current;
            var priceArray = _this.crawingService.crawlWithUrl(constant_1.constant.url);
            _this.cachedPrice.current = priceArray;
            _this.priceAnalyzerService.analyzePrice(_this.cachedPrice);
        });
    };
    return Application;
}());
exports.Application = Application;
try {
    dotenv_1.default.config();
    var app = new Application();
    app.run();
    console.log("Running on port " + app.port);
}
catch (e) {
    // log error
}
