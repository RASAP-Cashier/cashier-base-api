import { IsNotEmpty, Max, Min } from 'class-validator';

export class PaymentDto {
  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  year: number;

  @Min(0)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @IsNotEmpty()
  cardNumber: number;
}
