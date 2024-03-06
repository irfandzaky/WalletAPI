import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateAdminDto{
    @ApiProperty({
        description: 'Posisi admin di perusahaan'
    })
    @IsOptional()
    @IsNotEmpty()
    posisi: string;
}