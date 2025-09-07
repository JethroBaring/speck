import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrganizationInvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async create(
    organizationId: string,
    inviterId: string,
    createOrganizationInvitationDto: Prisma.OrganizationInvitationUncheckedCreateInput,
  ) {
    const organizationInvitation =
      await this.prisma.organizationInvitation.create({
        data: {
          ...createOrganizationInvitationDto,
          organizationId,
          roleId: createOrganizationInvitationDto.roleId,
        },
        include: {
          organization: true,
        },
      });

    const inviter = await this.prisma.user.findUnique({
      where: {
        id: inviterId,
      },
    });

    if (!inviter) {
      throw new NotFoundException('Inviter not found');
    }

    const tokenPayload = JSON.stringify({
      organizationInvitationId: organizationInvitation.id,
      organizationId: organizationInvitation.organizationId,
      roleId: organizationInvitation.roleId,
      inviterId: inviterId,
      inviteeEmail: organizationInvitation.email,
    });

    const token = this.cryptoService.encrypt(tokenPayload);

    await this.mailService.sendInvitationEmail({
      inviterName: inviter.name,
      inviteeEmail: organizationInvitation.email,
      organizationName: organizationInvitation.organization.name,
      invitationLink: `${this.configService.getOrThrow<string>(
        'BASE_URL',
      )}/${encodeURIComponent(token)}`,
    });

    return organizationInvitation;
  }

  async update(
    id: string,
    updateOrganizationInvitationDto: Prisma.OrganizationInvitationUpdateInput,
  ) {
    return await this.prisma.organizationInvitation.update({
      where: { id },
      data: updateOrganizationInvitationDto,
    });
  }

  async verifyInvitation(token: string) {
    const tokenPayload = this.cryptoService.decrypt(token);
    const tokenPayloadJson = JSON.parse(tokenPayload);
    return await this.prisma.organizationInvitation.findUnique({
      where: {
        id: tokenPayloadJson.organizationInvitationId,
        status: 'PENDING',
        createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) },
      },
    });
  }
}
