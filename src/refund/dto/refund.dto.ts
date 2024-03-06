import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, Min } from "class-validator";

export class RefundDto{
    @ApiProperty({
        description: 'Tanggal transaksi format tahun/bulan/hari'
    })
    @IsNotEmpty()
    @IsDateString()
    tanggal_transaksi: string;

    @ApiProperty({
        description: 'Jumlah saldo yang dikirim ketika melakukan transaksi dan nominal sama dengan transaksi'
    })
    @IsNotEmpty()
    @IsInt()
    @IsNumber()
    @Type(() => Number)
    jumlah_transaksi: number; 

    @ApiProperty({
        description: 'Dana/Ovo/Gopay/Shopeepay/LinkAja'
    })
    @IsNotEmpty()
    jenis_wallet: string;

    @ApiProperty({
        description: 'Format +62'
    })
    @IsNotEmpty()
    @IsPhoneNumber()
    nomor_wallet: string;

    @ApiProperty({
        description: 'Nama akun e-wallet yang terdaftar'
    })
    @IsNotEmpty()
    nama_wallet: string;

    @ApiProperty({
        description: 'Alasan mengajukan pengembalian dana'
    })
    @IsNotEmpty()
    @IsString()
    alasan: string;

    @ApiProperty({format:'binary'})
    bukti_refund: string;
}