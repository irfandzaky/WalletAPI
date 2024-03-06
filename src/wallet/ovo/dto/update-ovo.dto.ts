import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateOvoDto{
    @ApiProperty()
    @IsOptional()
    nama: string;

    @ApiProperty({
        description: 'Format +62'
    })
    @IsOptional()
    @IsPhoneNumber()
    nomor: string;
}
