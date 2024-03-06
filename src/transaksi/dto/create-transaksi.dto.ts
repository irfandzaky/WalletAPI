import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsPhoneNumber, Min } from "class-validator";

export class CreateTransaksiDto {
    @ApiProperty({
        description: 'isi Gopay, Shopeepay, LinkAja, Ovo, Dana'
    })
    @IsNotEmpty()
    tujuan: string;

    @ApiProperty({
        description: 'Format +62'
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    nomor_tujuan: string;

    @ApiProperty({
        description: 'Nama akun pada dompet digital'
    })
    @IsNotEmpty()
    nama_akun: string;
    
    @ApiProperty({
        description: 'Jumlah transaksi minimal 10k'
    })
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    @Type(() => Number)
    @Min(10000, { message: 'Minimal transaksi Rp10000'})
    jumlah: number;

    @ApiProperty()
    @IsOptional()
    catatan: string;
}
