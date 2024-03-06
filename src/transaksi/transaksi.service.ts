import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';
import { TransaksiRepository } from './repository/transaksi.repository';
import { JwtService } from '@nestjs/jwt';
import { Transaksi } from './entities/transaksi.entity';
import { FilterMetodeBayar } from './dto/filter-metode-bayar.dto';
import { DanaRepository } from '../wallet/dana/repository/dana.repository';
import { Dana } from 'src/wallet/dana/entities/dana.entity';
import { uploadBuktiDto } from './dto/upload-bukti.dto';
import { UserRepository } from 'src/users/repository/users.repository';
import { RefundDto } from '../refund/dto/refund.dto';
import { RefundRepository } from 'src/refund/repository/refund.repository';
import { Refund } from '../refund/entities/refund.entity';
import { SelectQueryBuilder } from 'typeorm';


@Injectable()
export class TransaksiService {
  constructor(
    @InjectRepository(TransaksiRepository)
    private readonly transaksiRepository: TransaksiRepository,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly danaRepository: DanaRepository,
    private readonly refundRepository: RefundRepository,
  ){}

  async getAllTransaksi(): Promise<Transaksi[]>{
    return await this.transaksiRepository.getAllTransaksi();
  }

  async filterMetode(filter: FilterMetodeBayar): Promise<Transaksi[]>{
    return await this.transaksiRepository.filterMetode(filter);
  }

  async getTransaksiByID(id: string): Promise<Transaksi>{
    // const transaksi = await this.transaksiRepository.findOne(id);
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where({id: id})
      .getOne()

    if(!transaksi){
        throw new NotFoundException(`Transaksi dengan ${id} tidak ditemukan`);
    }
    
    return transaksi;
  }

  async getTransaksiByIDforAdm(id: string): Promise<any>{
    // const transaksi = await this.transaksiRepository.findOne(id);
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .leftJoinAndSelect('transaksi.user', 'user')
      .where({id: id})
      .getOne()

    if(!transaksi){
        throw new NotFoundException(`Transaksi dengan ${id} tidak ditemukan`);
    }

    const dataTransaksi = {
      transaksi_id: transaksi.id,
      metode_bayar: transaksi.metode_bayar,
      tujuan: transaksi.tujuan,
      nomor_tujuan: transaksi.nomor_tujuan,
      nama_akun: transaksi.nama_akun,
      catatan: transaksi.catatan,
      jumlah: transaksi.jumlah,
      kode_unik: transaksi.kode_unik,
      total: transaksi.total,
      bukti: transaksi.bukti,
      status: transaksi.status,
      create_at: transaksi.create_at,
      data_user: {
        user_id: transaksi.user.id,
        user_name: transaksi.user.nama_lengkap,
      },
    };
    
    return dataTransaksi;
  }

  async getForCreateRefund(id: string): Promise<Transaksi>{
    const transaksi = await this.transaksiRepository.findOne(id);
    if(!transaksi){
      throw new NotFoundException(`Transaksi dengan ${id} tidak ditemukan`);
    }
    return transaksi;
  }

  async getTransaksiByUserID(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    //const transaksi = await this.transaksiRepository.find({ where: {user:user}});  
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where({user: user })
      .getMany();

    return transaksi;
  }

  async getAllTransaksiDana(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{metode_bayar: 'Dana'}, {tujuan: 'Dana'}])
      .getMany();

    return transaksi;

    // return this.transaksiRepository.find({
    //   where: [
    //     {metode_bayar: 'Dana',},
    //     {tujuan: 'Dana'}
    // ]
    // });
  }

  async getDanaByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }

    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{user: user, metode_bayar: 'Dana'}, {user: user, tujuan: 'Dana'}])
      .getMany();

    return transaksi;
    // return this.transaksiRepository.find({
    //   where: [
    //     {user: user, metode_bayar: 'Dana',},
    //     {user: user, tujuan: 'Dana'}
    // ]
    // });
  }

  async getAllTransaksiOvo(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{metode_bayar: 'Ovo'}, {tujuan: 'Ovo'}])
      .getMany();

    return transaksi;
  }

  async getOvoByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{user: user, metode_bayar: 'Ovo'}, {user: user, tujuan: 'Ovo'}])
      .getMany();

    return transaksi;
  }

  async getAllTransaksiLinkAja(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{metode_bayar: 'LinkAja'}, {tujuan: 'LinkAja'}])
      .getMany();

    return transaksi;
  }

  async getLinkAjaByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{user: user, metode_bayar: 'LinkAja'}, {user: user, tujuan: 'LinkAja'}])
      .getMany();

    return transaksi;
  }

  async getAllTransaksiGopay(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{metode_bayar: 'Gopay'}, {tujuan: 'Gopay'}])
      .getMany();

    return transaksi;
  }

  async getGopayByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{user: user, metode_bayar: 'Gopay'}, {user: user, tujuan: 'Gopay'}])
      .getMany();

    return transaksi;
  }

  async getAllTransaksiShopeepay(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{metode_bayar: 'Shopeepay'}, {tujuan: 'Shopeepay'}])
      .getMany();

    return transaksi;
  }

  async getShopeepayByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{user: user, metode_bayar: 'Shopeepay'}, {user: user, tujuan: 'Shopeepay'}])
      .getMany();

    return transaksi;
  }

  async getStatusMenunggu(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{status: 'Menunggu'}])
      .getMany();

    return transaksi;
  }

  async getStatusBerhasil(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{status: 'Berhasil'}])
      .getMany();

    return transaksi;
  }

  async getStatusGagal(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{status: 'Gagal'}])
      .getMany();

    return transaksi;
  }

  async getStatusDibatalkan(): Promise<Transaksi[]>{
    const transaksi = await this.transaksiRepository
      .createQueryBuilder('transaksi')
      .where([{status: 'Dibatalkan'}])
      .getMany();

    return transaksi;
  }

  async getStatusBerhasilByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
    .createQueryBuilder('transaksi')
    .where({user: user, status: 'Berhasil'})
    .getMany();

    return transaksi;
  }

  async getStatusGagalByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
    .createQueryBuilder('transaksi')
    .where({user: user, status: 'Gagal'})
    .getMany();

    return transaksi;
  }

  async getStatusDibatalkanByUserId(id: string): Promise<Transaksi[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }
    const transaksi = await this.transaksiRepository
    .createQueryBuilder('transaksi')
    .where({user: user, status: 'Dibatalkan'})
    .getMany();

    return transaksi;
  }

  async createTransaksiDana(createTransaksiDto: CreateTransaksiDto, metode_bayar, @Request() req){
    const transaksi = await this.transaksiRepository.createTransaksiDana(createTransaksiDto, metode_bayar, req);
    if (transaksi){
      const refund = await this.refundRepository.createRefund(transaksi, req);
      return{
        status: 201,
        message: 'Transaksi Berhasil dibuat',
        user_id: transaksi.user.id,
        nama_user: transaksi.user.nama_lengkap,
        data:{
          id: transaksi.id,
          metode_bayar: transaksi.metode_bayar,
          tujuan: transaksi.tujuan,
          nomor_tujuan: transaksi.nomor_tujuan,
          nama_akun : transaksi.nama_akun,
          catatan: transaksi.catatan,
          jumlah: transaksi.jumlah,
          biaya_administrasi: 1000,
          kode_unik: transaksi.kode_unik,
          total_bayar: transaksi.total,
          refund: transaksi.refund,
        }
      }
    }
  }

  async createTransaksiGopay(createTransaksiDto: CreateTransaksiDto, metode_bayar, @Request() req){
    const transaksi = await this.transaksiRepository.createTransaksiGopay(createTransaksiDto, metode_bayar, req);
    if (transaksi){
      const refund = await this.refundRepository.createRefund(transaksi, req);
      return{
        status: 201,
        message: 'Transaksi Berhasil dibuat',
        user_id: transaksi.user.id,
        nama_user: transaksi.user.nama_lengkap,
        data:{
          id: transaksi.id,
          metode_bayar: transaksi.metode_bayar,
          tujuan: transaksi.tujuan,
          nomor_tujuan: transaksi.nomor_tujuan,
          nama_akun : transaksi.nama_akun,
          catatan: transaksi.catatan,
          jumlah: transaksi.jumlah,
          biaya_administrasi: 1000,
          kode_unik: transaksi.kode_unik,
          total_bayar: transaksi.total,
          refund: transaksi.refund,
        }
      }
    }
  }

  async createTransaksiOvo(createTransaksiDto: CreateTransaksiDto, metode_bayar, @Request() req){
    const transaksi = await this.transaksiRepository.createTransaksiOvo(createTransaksiDto, metode_bayar, req);
    if (transaksi){
      const refund = await this.refundRepository.createRefund(transaksi, req);
      return{
        status: 201,
        message: 'Transaksi Berhasil dibuat',
        user_id: transaksi.user.id,
        nama_user: transaksi.user.nama_lengkap,
        data:{
          id: transaksi.id,
          metode_bayar: transaksi.metode_bayar,
          tujuan: transaksi.tujuan,
          nomor_tujuan: transaksi.nomor_tujuan,
          nama_akun : transaksi.nama_akun,
          catatan: transaksi.catatan,
          jumlah: transaksi.jumlah,
          biaya_administrasi: 1000,
          kode_unik: transaksi.kode_unik,
          total_bayar: transaksi.total,
          refund: transaksi.refund,
        }
      }
    }
  }

  async createTransaksiLinkAja(createTransaksiDto: CreateTransaksiDto, metode_bayar, @Request() req){
    const transaksi = await this.transaksiRepository.createTransaksiLinkAja(createTransaksiDto, metode_bayar, req);
    if (transaksi){
      const refund = await this.refundRepository.createRefund(transaksi, req);
      return{
        status: 201,
        message: 'Transaksi Berhasil dibuat',
        user_id: transaksi.user.id,
        nama_user: transaksi.user.nama_lengkap,
        data:{
          id: transaksi.id,
          metode_bayar: transaksi.metode_bayar,
          tujuan: transaksi.tujuan,
          nomor_tujuan: transaksi.nomor_tujuan,
          nama_akun : transaksi.nama_akun,
          catatan: transaksi.catatan,
          jumlah: transaksi.jumlah,
          biaya_administrasi: 1000,
          kode_unik: transaksi.kode_unik,
          total_bayar: transaksi.total,
          refund: transaksi.refund,
        }
      }
    }
  }

  async createTransaksiShopeepay(createTransaksiDto: CreateTransaksiDto, metode_bayar, @Request() req){
    const transaksi = await this.transaksiRepository.createTransaksiShopeepay(createTransaksiDto, metode_bayar, req);
    if (transaksi){
      const refund = await this.refundRepository.createRefund(transaksi, req);
      return{
        status: 201,
        message: 'Transaksi Berhasil dibuat',
        user_id: transaksi.user.id,
        nama_user: transaksi.user.nama_lengkap,
        data:{
          id: transaksi.id,
          metode_bayar: transaksi.metode_bayar,
          tujuan: transaksi.tujuan,
          nomor_tujuan: transaksi.nomor_tujuan,
          nama_akun : transaksi.nama_akun,
          catatan: transaksi.catatan,
          jumlah: transaksi.jumlah,
          biaya_administrasi: 1000,
          kode_unik: transaksi.kode_unik,
          total_bayar: transaksi.total,
          refund: transaksi.refund,
        }
      }
    }
  }

  async uploadBukti(id: string, uploadBuktiDto: uploadBuktiDto){
    const {bukti} = uploadBuktiDto;
    const transaksi = await this.getTransaksiByID(id);
    transaksi.bukti = bukti;
    transaksi.save();
    return{
      status: 201,
      message: 'Bukti telah diupload',
      data: {
        transaksi_id: transaksi.id,
        bukti: transaksi.bukti,
      }
    }
  }

  async createRefund(id: string, refundDto: RefundDto){
    const {tanggal_transaksi, jumlah_transaksi, jenis_wallet, nomor_wallet, nama_wallet, alasan, bukti_refund } = refundDto;
    const transaksi = await this.getForCreateRefund(id);
    if(transaksi.status !== 'Menunggu'){
      transaksi.refund.tanggal_transaksi = tanggal_transaksi;
      transaksi.refund.jumlah_transaksi = jumlah_transaksi;
      transaksi.refund.jenis_wallet = jenis_wallet;
      transaksi.refund.nomor_wallet = nomor_wallet;
      transaksi.refund.nama_wallet = nama_wallet;
      transaksi.refund.alasan = alasan;
      transaksi.refund.bukti_refund = bukti_refund;
      transaksi.refund.status_refund = 'Diajukan';
      transaksi.refund.save();

    return{
      status: 201,
      message: 'Pengembalian dana berhasil diajukan',
        data:{
          id: transaksi.refund.id,
          tanggal_transaksi: transaksi.refund.tanggal_transaksi,
          jumlah_transaksi: transaksi.refund.jumlah_transaksi,
          jenis_wallet: transaksi.refund.jenis_wallet,
          nomor_wallet: transaksi.refund.nomor_wallet,
          nama_wallet: transaksi.refund.nama_wallet,
          alasan: transaksi.refund.alasan,
          bukti_refund: transaksi.refund.bukti_refund,
        }
      }
    }
    throw new BadRequestException('Jika status transaksi menunggu tidak dapat melakukan proses pengembalian dana')
  }

  async statusBerhasil(id: string){
    const berhasil = await this.getTransaksiByID(id);
    berhasil.status = 'Berhasil';
    await berhasil.save();
    return{
      status: 201,
      transaksi_id: id,
      message: 'Transaksi dianggap berhasil',
    }
  }

  async statusGagal(id: string){
    const gagal = await this.getTransaksiByID(id);
    gagal.status = 'Gagal';
    await gagal.save();
    return{
      status: 201,
      transaksi_id: id,
      message: 'Transaksi dianggap gagal',
    }
  }

  async statusBatal(id: string){
    const batal = await this.getTransaksiByID(id);
    batal.status = 'Dibatalkan';
    await batal.save();
    return{
       status: 201,
       transaksi_id: id,
       message: 'Transaksi dibatalkan',
    }
  }

  async deleteTransaksi(id:string): Promise<any>{
    const result = await this.transaksiRepository.delete(id);
    if (result.affected == 0){
      throw new NotFoundException(`Transaksi dengan id ${id} tidak ditemukan`)
    }
    return {
      status: 201,
      message: 'Transaksi berhasil dihapus',
    }
  }
}
