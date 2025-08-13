import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { Prisma } from '@repo/types/generated/prisma';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import {
  PageCreateInputSchema,
  PageElementCreateInputSchema,
  PageUpdateInputSchema,
} from '@repo/types/prisma/generated/zod';
import { PageElementsService } from 'src/page-elements/page-elements.service';

@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    private readonly pageElementsService: PageElementsService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagesService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(PageUpdateInputSchema))
  update(
    @Param('id') id: string,
    @Body() updatePageDto: Prisma.PageUpdateInput,
  ) {
    return this.pagesService.update(+id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(+id);
  }

  // Page Elements
  @Post(':id/page-elements')
  @UsePipes(new ZodValidationPipe(PageElementCreateInputSchema))
  createPageElement(
    @Param('id') id: string,
    @Body() createPageElementDto: any,
  ) {
    return this.pageElementsService.create(+id, createPageElementDto);
  }

  @Get(':id/page-elements')
  findPageElements(@Param('id') id: string) {
    return this.pageElementsService.findAll(+id);
  }
}
