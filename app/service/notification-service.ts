import nodemailer from 'nodemailer';

export class NotificationService {
    private service = process.env.service || '';
    private pass = process.env.pass || '';
    private from = process.env.from || '';
    private to = process.env.to || '';

    private transport = {
        service: this.service,
        auth: {
            user: this.from,
            pass: this.pass
        }
    };
    private mailOptions = {
        from: this.from,
        to: this.to,
        subject: '600 Drake Crawler Notification System',
        text: ''
    };

    constructor() {
    }

    sendMail(overridenOption?: any) {
        if (overridenOption) {
            this.mailOptions = {
                ...this.mailOptions,
                text: overridenOption.text
            };
        }

        const transporter = nodemailer.createTransport(this.transport);

        transporter.sendMail(this.mailOptions, (err, info) => {
            if (err) {
                // log error
                console.log(err);
            } else {
                // log email sent
                console.log(info);
            }
        });
    }
}