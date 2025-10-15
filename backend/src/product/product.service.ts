import { Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { FindOptionsWhere, Repository, Like, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private userRepository: Repository<Product>,
  ) {}

  async findAll(queryDto: ProductQueryDto) {
    const { search, sortBy, sortOrder, page, limit } = queryDto;

    const whereConditions: any = {};

    if (search) {
      whereConditions.product_name = Like(`%${search}%`);
    }

    const order: any = {};
    if (sortBy) {
      order[sortBy] = sortOrder || 'DESC';
    } else {
      order.createdAt = 'DESC';
    }

    const skip = ((page || 1) - 1) * (limit || 10);

    const [products, total] = await this.userRepository.findAndCount({
      where:
        Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
      order,
      skip,
      take: limit || 10,
    });

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / (limit || 10)),
    };
  }

  create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.userRepository.create(product);
    return this.userRepository.save(newProduct);
  }

  update(id: number, product: Partial<Product>): Promise<UpdateResult> {
    return this.userRepository.update(id, product);
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
