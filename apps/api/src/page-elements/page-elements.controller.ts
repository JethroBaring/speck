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
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe';
import { PageElementUpdateInputSchema } from '@repo/types/zod/index';
import { PageElementsService } from './page-elements.service';

@Controller('page-elements')
export class PageElementsController {
  constructor(private readonly pageElementsService: PageElementsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageElementsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(PageElementUpdateInputSchema)) updatePageElementDto: any) {
    return this.pageElementsService.update(+id, updatePageElementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageElementsService.remove(+id);
  }
}
