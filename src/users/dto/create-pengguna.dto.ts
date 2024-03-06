import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreatePenggunaDto{
    // @ApiProperty({format:'binary'})
    // @IsOptional()
    // foto_profil: string;

    @ApiProperty({
        description: 'Format +62'
    })
    @IsOptional()
    @IsNotEmpty()
    nomor_hp: string;
}