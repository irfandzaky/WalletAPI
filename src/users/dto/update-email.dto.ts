import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber } from "class-validator";

export class updateEmailDto{
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}