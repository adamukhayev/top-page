import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus, NotFoundException,
  Param,
  Patch,
  Post,
  Put, UseGuards, UsePipes, ValidationPipe
} from "@nestjs/common";
import { ProductModel } from "./product.model/product.model";
import { FindProductDto } from "./dto/find-product.dto";
import { CreateProductDto } from "./dto/create.product.dto";
import { ProductService } from "./product.service";
import { REVIEW_NOT_FOUND } from "../review/review.constants";
import { PRODUCT_NOT_FOUND } from "./product.constants";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";

@Controller('product')
export class ProductController {

  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', IdValidationPipe) id: string) {
    const product = this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateProductDto) {

    const updatedProduct =  this.productService.updateById(id, dto);

    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }

    return updatedProduct;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct =  this.productService.deleteById(id);

    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
