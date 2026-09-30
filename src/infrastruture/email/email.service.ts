import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';


interface SendMailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

@Injectable()
export class EmailService {
    private readonly transporter: Transporter;
    private readonly from: string;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const host = this.configService.getOrThrow<string>('email.host');
        const port = this.configService.getOrThrow<number>('email.port');
        const user = this.configService.get<string>('email.user');
        const password = this.configService.get<string>('email.password');

        this.from = this.configService.getOrThrow<string>('email.from');

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure: false,
            ...(user && password
                ? {
                    auth: {
                        user,
                        pass: password,
                    },
                }
                : {}),
        });
    }

    async sendEmail(options: SendMailOptions): Promise<void> {
        await this.transporter.sendMail({
            from: this.from,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
    }
}