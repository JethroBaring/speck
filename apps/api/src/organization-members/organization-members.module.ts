import { Module } from '@nestjs/common';
import { OrganizationMembersService } from './organization-members.service';

@Module({
  controllers: [],
  providers: [OrganizationMembersService],
  exports: [OrganizationMembersService],
})
export class OrganizationMembersModule {}
