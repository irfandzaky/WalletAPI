import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber } from 'class-validator';
import { CreateTransaksiDto } from './create-transaksi.dto';
import { Type } from 'class-transformer';

export class UpdateTransaksiDto {
    @ApiProperty()
    @IsNotEmpty()
    tujuan: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsPhoneNumber()
    nomor_tujuan: string;

    @ApiProperty()
    @IsNotEmpty()
    nama_akun: string;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    jumlah: number;

    @ApiProperty()
    @IsOptional()
    catatan: string;
}
