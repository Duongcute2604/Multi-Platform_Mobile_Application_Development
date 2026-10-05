import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RecipeReferencesService } from './recipe-references.service';
import { RecipeReferenceQueryDto } from './dto/recipe-reference-query.dto';
import { AdminGuard } from '../../common/admin.guard';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';

@ApiTags('Recipe References')
@ApiBearerAuth()
@Controller('recipe-references')
export class RecipeReferencesController {
  constructor(private readonly service: RecipeReferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách recipe references (phân trang)' })
  findAll(@Query() query: RecipeReferenceQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết recipe reference' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Đồng bộ recipe references từ Spoonacular (chỉ ADMIN)' })
  async sync(@Body() body: { source: 'SPOONACULAR' }) {
    return this.service.sync(body.source);
  }
}
