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
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import {
  PageElementCreateInputSchema,
  PageUpdateInputSchema,
} from '@repo/types/zod/index';
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
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(PageUpdateInputSchema)) updatePageDto: any,
  ) {
    return this.pagesService.update(+id, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(+id);
  }

  // Page Elements
  @Post(':id/page-elements')
  createPageElement(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(PageElementCreateInputSchema)) createPageElementDto: any,
  ) {
    return this.pageElementsService.create(+id, createPageElementDto);
  }

  @Get(':id/page-elements')
  findPageElements(@Param('id') id: string) {
    return this.pageElementsService.findAll(+id);
  }
}
