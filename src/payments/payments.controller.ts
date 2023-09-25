import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pay')
  @ApiOperation({ summary: 'Create charge in Stripe' })
  @ApiResponse({ status: 201, description: 'Created Charge in Stripe.' })
  async pay(@Body() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
  
}
