import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async cleanUpExpiredInvitations() {
    try {
      await this.prisma.organizationInvitation.updateMany({
        where: {
          status: 'PENDING',
          // 1 day ago
          createdAt: { lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1) },
        },
        data: { status: 'EXPIRED' },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
