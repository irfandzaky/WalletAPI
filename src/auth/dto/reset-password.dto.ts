import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password minimal 8 kata dan maksimal 20 kata'
})
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword: string;
   
  @ApiProperty({
    description: 'Password minimal 8 kata dan maksimal 20 kata'
})
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  confirmNewPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}