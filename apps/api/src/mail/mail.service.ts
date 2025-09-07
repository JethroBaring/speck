import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  async sendInvitationEmail(data: {
    inviterName: string;
    inviteeEmail: string;
    organizationName: string;
    invitationLink: string;
  }) {
    const template = fs.readFileSync(
      `./src/mail/email-templates/invitation-email.hbs`,
      'utf-8',
    );
    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate(data);

    try {
      const result = await this.mailService.sendMail({
        from: 'Intervuave <intervuave@gmail.com>',
        to: data.inviteeEmail,
        subject: `${data.organizationName} Invitation to Join Workspace`,
        html: html,
      });

      return result;
    } catch (error: any) {
      throw new Error('Error sending email: ' + error);
    }
  }
}
