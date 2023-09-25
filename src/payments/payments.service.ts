import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateChargeDto } from './dto/create-charge.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-08-16' })

    async createCharge({card, amount}:CreateChargeDto) {

        const paymentIntent = await this.stripe.paymentIntents.create({
            payment_method: "pm_card_visa",
            amount: amount * 100,
            currency: 'usd'
        });

        return paymentIntent;
    }
}
