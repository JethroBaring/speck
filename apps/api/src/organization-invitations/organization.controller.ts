import { Controller, Post, Param } from '@nestjs/common';
import { OrganizationInvitationsService } from './organization-invitations.service';
import { Session } from "@mguay/nestjs-better-auth";
import type { UserSession } from "@mguay/nestjs-better-auth";

@Controller('organizations/invitations')
export class OrganizationInvitationsController {
  constructor(
    private readonly organizationInvitationsService: OrganizationInvitationsService,
  ) {}

  @Post(':token/verify')
  verifyInvitation(
    @Param('token') token: string,
  ) {
    return this.organizationInvitationsService.verifyInvitation(token);
  }

  
}
