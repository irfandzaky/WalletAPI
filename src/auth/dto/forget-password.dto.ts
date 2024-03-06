import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class ForgetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}