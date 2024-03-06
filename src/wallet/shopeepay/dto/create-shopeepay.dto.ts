import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";

export class CreateShopeepayDto{
    @ApiProperty()
    @IsNotEmpty()
    nama: string;

    @ApiProperty({
        description: 'Format +62'
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    nomor: string;
}