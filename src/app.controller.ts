import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentDto } from './types/payment.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('STRIPE') private stripeService: ClientProxy,
    @Inject('CHECKOUT') private checkoutService: ClientProxy,
  ) {}

  @Public()
  @Post('/stripe')
  async checkoutStripe(@Body() payment: PaymentDto) {
    try {
      return this.stripeService.send({ cmd: 'stripe_pay' }, payment);
    } catch (error) {
      throw new Error(error.body);
    }
  }

  @Public()
  @Post('/checkout')
  checkout(@Body() payment: PaymentDto) {
    try {
      return this.checkoutService.send(
        {
          cmd: 'checkout_pay',
        },
        payment,
      );
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
