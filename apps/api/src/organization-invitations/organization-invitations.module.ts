import { Module } from '@nestjs/common';
import { OrganizationInvitationsService } from './organization-invitations.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [],
  providers: [OrganizationInvitationsService, CryptoService, MailService],
  exports: [OrganizationInvitationsService],
})
export class OrganizationInvitationsModule {}
