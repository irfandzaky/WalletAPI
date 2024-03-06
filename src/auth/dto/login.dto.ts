import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password minimal 8 kata dan maksimal 20 kata'
    })
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    password: string;
}