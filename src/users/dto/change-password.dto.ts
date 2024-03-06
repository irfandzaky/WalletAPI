import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
    @ApiProperty({ description: 'Password saat ini' })
    @IsNotEmpty()
    currentPassword: string;
    
    @ApiProperty({
        description: 'Password minimal 8 kata dan maksimal 20 kata'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    newPassword: string;
   
    @ApiProperty({
        description: 'Password minimal 8 kata dan maksimal 20 kata'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    confirmNewPassword: string;
   }