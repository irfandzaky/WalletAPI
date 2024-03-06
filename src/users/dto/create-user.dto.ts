import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class CreateUserDto{
    @ApiProperty()
    @IsNotEmpty()
    nama_lengkap: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        description: 'Password minimal terdiri dari 6 huruf'
    })
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}