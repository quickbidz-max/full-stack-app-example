import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { UpdateResult } from 'typeorm';
import { DeleteResult } from 'typeorm/browser';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { ProductQueryDto } from './dto/product-query.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtGuard)
  @Get()
  getAll(@Query() queryDto: ProductQueryDto) {
    return this.productService.findAll(queryDto);
  }

  @UseGuards(JwtGuard)
  @Post()
  createProduct(@Body() body: Partial<Product>): Promise<Product> {
    return this.productService.create(body);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() body: Partial<Product>,
  ): Promise<UpdateResult> {
    return this.productService.update(id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteProduct(@Param('id') id: number): Promise<DeleteResult> {
    return this.productService.delete(id);
  }
}
