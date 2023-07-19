import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { FindTopPageDto } from "./dto/find-top-page.dto";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { TopPageService } from "./top-page.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@Controller('top-page')
export class TopPageController {

  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.createTopPage(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.getTopPageById(id);
  }

  @Get('byAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    return this.topPageService.getTopPageByAlias(alias);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id', IdValidationPipe) id: string,
               @Body() dto: CreateTopPageDto) {
    return this.topPageService.updateTopPageById(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return this.topPageService.deleteTopPageById(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.textSearch(text);
  }
}
