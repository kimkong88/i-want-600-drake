import schedule, { JobCallback } from 'node-schedule';

export class SchedulerService {
    constructor() {
    }

    runJob(cron: string, job: JobCallback) {
        schedule.scheduleJob(cron, job);
    }
}