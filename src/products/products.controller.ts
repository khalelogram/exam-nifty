import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/users/auth.guard';
import { RolesGuard } from 'src/users/roles.guard';
import { Roles } from 'src/users/roles.decorator';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Post()
  @ApiOperation({ summary: 'Create new product in Stripe' })
  @ApiResponse({ status: 201, description: 'Created new product in Stripe.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get()
  @ApiOperation({ summary: 'List all products in Stripe' })
  @ApiResponse({ status: 201, description: 'List all products in Stripe.' })
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single product in Stripe' })
  @ApiResponse({ status: 201, description: 'Retrieve a single product in Stripe' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product in Stripe' })
  @ApiResponse({ status: 201, description: 'Update a product in Stripe' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['admin'])
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product in Stripe' })
  @ApiResponse({ status: 201, description: 'Delete a product in Stripe' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
