import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber } from "class-validator";

export class updateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    nama_lengkap: string;

    @ApiProperty({
        description: 'format +62'
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    nomor_hp: string;

}