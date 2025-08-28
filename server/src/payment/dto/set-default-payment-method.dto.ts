import { IsString, IsNotEmpty } from 'class-validator';

export class SetDefaultPaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  paymentMethodId: string;
}
