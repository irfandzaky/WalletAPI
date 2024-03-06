import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateShopeepayDto{
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
