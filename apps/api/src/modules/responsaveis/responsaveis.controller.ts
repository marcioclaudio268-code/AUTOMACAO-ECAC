import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';

import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie-auth.guard';
import { CreateResponsavelDto } from './dto/create-responsavel.dto';
import { UpdateResponsavelDto } from './dto/update-responsavel.dto';
import { ResponsaveisService } from './responsaveis.service';

@UseGuards(JwtCookieAuthGuard)
@Controller('responsaveis')
export class ResponsaveisController {
  constructor(private readonly responsaveisService: ResponsaveisService) {}

  @Post()
  create(@Body() createResponsavelDto: CreateResponsavelDto) {
    return this.responsaveisService.create(createResponsavelDto);
  }

  @Get()
  findAll() {
    return this.responsaveisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsaveisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsavelDto: UpdateResponsavelDto) {
    return this.responsaveisService.update(id, updateResponsavelDto);
  }
}
