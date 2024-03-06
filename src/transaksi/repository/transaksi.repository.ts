import { EntityRepository, Repository } from 'typeorm';
import { Transaksi } from '../entities/transaksi.entity';
import { CreateTransaksiDto } from '../dto/create-transaksi.dto';
import { InternalServerErrorException, Request } from '@nestjs/common';
import { FilterMetodeBayar } from '../dto/filter-metode-bayar.dto';

@EntityRepository(Transaksi)
export class TransaksiRepository extends Repository<Transaksi>{
    async getAllTransaksi(): Promise<Transaksi[]>{
        const query = this.createQueryBuilder('transaksi');
        return await query.getMany();
    }

    async filterMetode(filter: FilterMetodeBayar): Promise<Transaksi[]>{
        const { metode_bayar } = filter;
        const query = this.createQueryBuilder('metode_bayar');
        if(metode_bayar){
            query.andWhere(`lower(transaksi.metode_bayar) LIKE: metode_bayar`,{metode_bayar: `%${metode_bayar.toLowerCase()}%`,});
        }

        return await query.getMany();
    }

    async createTransaksiDana(createTransaksiDto: CreateTransaksiDto, metode_bayar, @Request() req){
        const {tujuan, nomor_tujuan, nama_akun, jumlah, catatan} = createTransaksiDto;

        const transaksi = this.create();
        transaksi.user = req;
        transaksi.tujuan = tujuan;
        transaksi.nomor_tujuan = nomor_tujuan;
        transaksi.nama_akun = nama_akun;
        transaksi.jumlah = jumlah;
        transaksi.catatan = catatan;
        const crypto = require('crypto');
        const createHash = (typeof crypto.createHash === 'function') ? crypto.createHash : crypto.webcrypto.createHash;
        // fungsi membuat createhash pada library kripto , createhash pada node 13.6 keatas mengalami deprecated
        const timestamp = Date.now();
        const randomValue = Math.floor(Math.random() * 1000);
        const uniqueHash = crypto.createHash('sha256').update(timestamp + randomValue.toString()).digest('hex');
        // nge hash dengan heksadesimal dan membatasi agar hari tersebut tidak terdapat kode unik yang sama dan akan reset setiap hari
        transaksi.kode_unik = parseInt(uniqueHash.slice(0, 12), 16) % 500 + 1;
        // menggunakan heksadesimal 0 - 9 atau bentuk desimal 0 - 9 dalam heksadesimal(16)  dan membatasi minimal 1 dan maksimal 500
        //transaksi.kode_unik = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        const biaya_admin = 1000;
        transaksi.total = jumlah + biaya_admin + transaksi.kode_unik;
        transaksi.status = 'Menunggu';
        transaksi.metode_bayar = metode_bayar;
        // transaksi.isRefund = isRefund;

        try{
            return await transaksi.save()
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }

    async createTransaksiOvo(createTransaksiDto: CreateTransaksiDto,metode_bayar, @Request() req){
        const {tujuan, nomor_tujuan, nama_akun, jumlah, catatan} = createTransaksiDto;

        const transaksi = this.create();
        transaksi.user = req;
        transaksi.tujuan = tujuan;
        transaksi.nomor_tujuan = nomor_tujuan;
        transaksi.nama_akun = nama_akun;
        transaksi.jumlah = jumlah;
        transaksi.catatan = catatan;
        const crypto = require('crypto');
        const createHash = (typeof crypto.createHash === 'function') ? crypto.createHash : crypto.webcrypto.createHash;
        // fungsi membuat createhash pada library kripto , createhash pada node 13.6 keatas mengalami deprecated
        const timestamp = Date.now();
        const randomValue = Math.floor(Math.random() * 1000);
        const uniqueHash = crypto.createHash('sha256').update(timestamp + randomValue.toString()).digest('hex');
        // nge hash dengan heksadesimal dan membatasi agar hari tersebut tidak terdapat kode unik yang sama dan akan reset setiap hari
        transaksi.kode_unik = parseInt(uniqueHash.slice(0, 12), 16) % 500 + 1;
        // menggunakan heksadesimal 0 - 9 atau bentuk desimal 0 - 9 dalam heksadesimal(16)  dan membatasi minimal 1 dan maksimal 500
        //transaksi.kode_unik = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        const biaya_admin = 1000;
        transaksi.total = jumlah + biaya_admin + transaksi.kode_unik;
        transaksi.status = 'Menunggu';
        transaksi.metode_bayar = metode_bayar;

        try{
            return await transaksi.save()
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }

    async createTransaksiGopay(createTransaksiDto: CreateTransaksiDto,metode_bayar, @Request() req){
        const {tujuan, nomor_tujuan, nama_akun, jumlah, catatan} = createTransaksiDto;

        const transaksi = this.create();
        transaksi.user = req;
        transaksi.tujuan = tujuan;
        transaksi.nomor_tujuan = nomor_tujuan;
        transaksi.nama_akun = nama_akun;
        transaksi.jumlah = jumlah;
        transaksi.catatan = catatan;
        const crypto = require('crypto');
        const createHash = (typeof crypto.createHash === 'function') ? crypto.createHash : crypto.webcrypto.createHash;
        // fungsi membuat createhash pada library kripto , createhash pada node 13.6 keatas mengalami deprecated
        const timestamp = Date.now();
        const randomValue = Math.floor(Math.random() * 1000);
        const uniqueHash = crypto.createHash('sha256').update(timestamp + randomValue.toString()).digest('hex');
        // nge hash dengan heksadesimal dan membatasi agar hari tersebut tidak terdapat kode unik yang sama dan akan reset setiap hari
        transaksi.kode_unik = parseInt(uniqueHash.slice(0, 12), 16) % 500 + 1;
        // menggunakan heksadesimal 0 - 9 atau bentuk desimal 0 - 9 dalam heksadesimal(16)  dan membatasi minimal 1 dan maksimal 500
        //transaksi.kode_unik = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        const biaya_admin = 1000;
        transaksi.total = jumlah + biaya_admin + transaksi.kode_unik;
        transaksi.status = 'Menunggu';
        transaksi.metode_bayar = metode_bayar;

        try{
            return await transaksi.save()
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }

    async createTransaksiShopeepay(createTransaksiDto: CreateTransaksiDto,metode_bayar, @Request() req){
        const {tujuan, nomor_tujuan, nama_akun, jumlah, catatan} = createTransaksiDto;

        const transaksi = this.create();
        transaksi.user = req;
        transaksi.tujuan = tujuan;
        transaksi.nomor_tujuan = nomor_tujuan;
        transaksi.nama_akun = nama_akun;
        transaksi.jumlah = jumlah;
        transaksi.catatan = catatan;
        const crypto = require('crypto');
        const createHash = (typeof crypto.createHash === 'function') ? crypto.createHash : crypto.webcrypto.createHash;
        // fungsi membuat createhash pada library kripto , createhash pada node 13.6 keatas mengalami deprecated
        const timestamp = Date.now();
        const randomValue = Math.floor(Math.random() * 1000);
        const uniqueHash = crypto.createHash('sha256').update(timestamp + randomValue.toString()).digest('hex');
        // nge hash dengan heksadesimal dan membatasi agar hari tersebut tidak terdapat kode unik yang sama dan akan reset setiap hari
        transaksi.kode_unik = parseInt(uniqueHash.slice(0, 12), 16) % 500 + 1;
        // menggunakan heksadesimal 0 - 9 atau bentuk desimal 0 - 9 dalam heksadesimal(16)  dan membatasi minimal 1 dan maksimal 500
        //transaksi.kode_unik = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        const biaya_admin = 1000;
        transaksi.total = jumlah + biaya_admin + transaksi.kode_unik;
        transaksi.status = 'Menunggu';
        transaksi.metode_bayar = metode_bayar;

        try{
            return await transaksi.save()
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }

    async createTransaksiLinkAja(createTransaksiDto: CreateTransaksiDto,metode_bayar, @Request() req){
        const {tujuan, nomor_tujuan, nama_akun, jumlah, catatan} = createTransaksiDto;

        const transaksi = this.create();
        transaksi.user = req;
        transaksi.tujuan = tujuan;
        transaksi.nomor_tujuan = nomor_tujuan;
        transaksi.nama_akun = nama_akun;
        transaksi.jumlah = jumlah;
        transaksi.catatan = catatan;
        const crypto = require('crypto');
        const createHash = (typeof crypto.createHash === 'function') ? crypto.createHash : crypto.webcrypto.createHash;
        // fungsi membuat createhash pada library kripto , createhash pada node 13.6 keatas mengalami deprecated
        const timestamp = Date.now();
        const randomValue = Math.floor(Math.random() * 1000);
        const uniqueHash = crypto.createHash('sha256').update(timestamp + randomValue.toString()).digest('hex');
        // nge hash dengan heksadesimal dan membatasi agar hari tersebut tidak terdapat kode unik yang sama dan akan reset setiap hari
        transaksi.kode_unik = parseInt(uniqueHash.slice(0, 12), 16) % 500 + 1;
        // menggunakan heksadesimal 0 - 9 atau bentuk desimal 0 - 9 dalam heksadesimal(16)  dan membatasi minimal 1 dan maksimal 500
        //transaksi.kode_unik = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        const biaya_admin = 1000;
        transaksi.total = jumlah + biaya_admin + transaksi.kode_unik;
        transaksi.status = 'Menunggu';
        transaksi.metode_bayar = metode_bayar;

        try{
            return await transaksi.save()
        }catch(e){
            throw new InternalServerErrorException(e);
        }
    }

}