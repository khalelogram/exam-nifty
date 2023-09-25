import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import Stripe from 'stripe';

@Injectable()
export class ProductsService {

  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' })

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.stripe.products.create({
      ...createProductDto
    })

    return newProduct;
  }

  async findAll() {
    const products = await this.stripe.products.list()

    return products;
  }

  async findOne(id: string) {
    const product = await this.stripe.products.retrieve(id)

    return product;
  }

  async update(id: string, body: any) {
    const updatedProduct = await this.stripe.products.update(id, {
      ...body
    })

    return updatedProduct;
  }

  async remove(id: string) {
    const deleted = await this.stripe.products.del(id)

    return deleted;
  }
}
