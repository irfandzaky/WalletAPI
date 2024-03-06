import { BadRequestException, Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DanaRepository } from '../wallet/dana/repository/dana.repository';
import { UserRepository } from 'src/users/repository/users.repository';
import { RefundDto } from '../refund/dto/refund.dto';
import { RefundRepository } from 'src/refund/repository/refund.repository';
import { Refund } from '../refund/entities/refund.entity';
import { SelectQueryBuilder } from 'typeorm';
import { Transaksi } from 'src/transaksi/entities/transaksi.entity';
import { TransaksiRepository } from 'src/transaksi/repository/transaksi.repository';


@Injectable()
export class RefundService {
  constructor(
    @InjectRepository(RefundRepository)
    private readonly transaksiRepository: TransaksiRepository,
    private readonly userRepository: UserRepository,
    private readonly refundRepository: RefundRepository,
  ){}

  async getAllRefund(): Promise<Refund[]>{
    return this.refundRepository.find({
      where: [
        {status_refund: 'Diajukan'},
        {status_refund: 'Disetujui'},
        {status_refund: 'Ditolak'},
        {status_refund: 'Dana terkirim'}
    ]
    });
  }

  async getRefundByID(id: string): Promise<Refund>{
    //const refund = await this.refundRepository.findOne(id);
    const refund = await this.refundRepository
    .createQueryBuilder('refund')
    .leftJoinAndSelect('refund.transaksi', 'transaksi')
    .where({id: id})
    .getOne();
    if(!refund){
      throw new NotFoundException(`Pengembalian dana dengan ${id} tidak ditemukan`);
    }
    return refund;
  }

  async getRefundByUserID(id: string): Promise<Refund[]>{
    const user = await this.userRepository.findOne(id);
    if(!user){
      throw new NotFoundException(`ID user ${id} tidak ditemukan`);
    }

    const refund = await this.refundRepository.find({ 
      where: [
          {user: user, status_refund: 'Diajukan'},
          {user: user, status_refund: 'Disetujui'},
          {user: user, status_refund: 'Ditolak'},
          {user: user, status_refund: 'Dana terkirim'}
      ]
    });

    return refund;
  }

  
  async getRefundDiajukan(): Promise<Refund[]>{
    // return this.refundRepository.find({
    //   where: [
    //     {status_refund: 'Diajukan'}
    // ]
    // });
      return await this.refundRepository.createQueryBuilder('refund')
      .leftJoinAndSelect('refund.transaksi', 'transaksi')
      .where('refund.status_refund = :status', { status: 'Diajukan' })
      .getMany()
  }
  
  async getRefundDisetujui(): Promise<Refund[]>{
    return this.refundRepository.find({
      where: [
        {status_refund: 'Disetujui'}
    ]
    });
  }

  async getRefundDitolak(): Promise<Refund[]>{
    return this.refundRepository.find({
      where: [
        {status_refund: 'Ditolak'}
    ]
    });
  }

  async getRefundDanaTerkirim(): Promise<Refund[]>{
    // return this.refundRepository.find({
    //   where: [
    //     {status_refund: 'Dana Terkirim'}
    // ]
    // });

    return await this.refundRepository.createQueryBuilder('refund')
      .leftJoinAndSelect('refund.transaksi', 'transaksi')
      .where('refund.status_refund = :status', { status: 'Dana Terkirim' })
      .getMany()
  }

  // const queryBuilder = this.refundRepository.createQueryBuilder('refund');
    
  //   queryBuilder
  //   .leftJoinAndSelect('refund.user', 'user')
  //   .where('user.id = :id', { id })
  //   .andWhere('refund.status_refund = :status', { status: 'Pengembalian dana telah diajukan' })
  //   .orWhere('refund.status_refund = :status2', { status2: 'Pengembalian dana disetujui' });

  //   const refund = await queryBuilder.getMany();
  // KODE DIATAS MENAMPILKAN STATUS REFUND

  // async createRefund(id: string, refundDto: RefundDto, @Request() req){
  //   const {tanggal_transaksi, jumlah_transaksi, jenis_wallet, nomor_wallet, nama_wallet, alasan, bukti_refund } = refundDto;
  //   const transaksi = await this.getTransaksiByID(id);
  //   if(transaksi.status !== 'Menunggu'){
  //     transaksi.refund.tanggal_transaksi = tanggal_transaksi;
  //     transaksi.refund.jumlah_transaksi = jumlah_transaksi;
  //     transaksi.refund.jenis_wallet = jenis_wallet;
  //     transaksi.refund.nomor_wallet = nomor_wallet;
  //     transaksi.refund.nama_wallet = nama_wallet;
  //     transaksi.refund.alasan = alasan;
  //     transaksi.refund.bukti_refund = bukti_refund;
  //     transaksi.refund.status_refund = 'Diajukan';
  //     transaksi.refund.save();

  //   return{
  //     status: 201,
  //     message: 'Pengembalian dana berhasil diajukan',
  //       data:{
  //         id: transaksi.id,
  //         tanggal_transaksi: transaksi.refund.tanggal_transaksi,
  //         jumlah_transaksi: transaksi.refund.jumlah_transaksi,
  //         jenis_wallet: transaksi.refund.jenis_wallet,
  //         nomor_wallet: transaksi.refund.nomor_wallet,
  //         nama_wallet: transaksi.refund.nama_wallet,
  //         alasan: transaksi.refund.alasan,
  //         bukti_refund: transaksi.refund.bukti_refund,
  //       }
  //     }
  //   }
  //   throw new BadRequestException('Jika status transaksi menunggu tidak dapat melakukan proses pengembalian dana')
  // }

  async statusRefundSetuju(id: string){
    const setuju = await this.getRefundByID(id);
    setuju.status_refund = 'Disetujui';
    await setuju.save();
    return{
        message: 'Pengembalian dana disetujui'
    }
  }

  async statusRefundTolak(id: string){
    const tolak = await this.getRefundByID(id);
    tolak.status_refund = 'Ditolak';
    await tolak.save();
    return{
        message: 'Pengembalian dana ditolak'
    }
  }

  async statusRefundBerhasil(id: string){
    const berhasil = await this.getRefundByID(id);
    berhasil.status_refund = 'Dana terkirim';
    await berhasil.save();
    return{
        message: 'Pengembilian dana berhasil dan dana telah dikirim'
    }
  }

  async deleteRefund(id:string): Promise<any>{
    const result = await this.refundRepository.delete(id);
    if (result.affected == 0){
      throw new NotFoundException(`Refund dengan id ${id} tidak ditemukan`)
    }
    return {
      status: 201,
      message: 'Pengembalian dana berhasil dihapus',
    }
  }
}
