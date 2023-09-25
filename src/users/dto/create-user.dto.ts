import { IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty()
    @IsNotEmpty()
    email: string;
    
    date_created: Date;
    date_updated: Date;
    
}
