import { IsDefined, IsNotEmptyObject, IsNumber, ValidateNested } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateChargeDto {

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @ApiProperty()
    card: {
        /**
         * The card's CVC. It is highly recommended to always include this value.
         */
        cvc?: string;

        /**
         * Two-digit number representing the card's expiration month.
         */
        exp_month: number;

        /**
         * Four-digit number representing the card's expiration year.
         */
        exp_year: number;

        /**
         * The card number, as a string without any separators.
         */
        number: string;
    };
    

    @ApiProperty()
    @IsNumber()
    amount: number;
    
}