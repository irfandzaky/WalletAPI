import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGopayDto } from './dto/create-gopay.dto';
import { UpdateGopayDto } from './dto/update-gopay.dto';
import { GopayRepository } from './repository/gopay.repository';
import { Gopay } from './entities/gopay.entity';

@Injectable()
export class GopayService {
  constructor(
    @InjectRepository(GopayRepository)
    private readonly gopayRepository: GopayRepository,
    private readonly jwtService: JwtService,
  ){}

  async getGopay(): Promise<Gopay[]>{
    return this.gopayRepository.getAllGopay();
  }

  async getGopayById(id: string): Promise<Gopay>{
    const dompet = await this.gopayRepository.findOne(id);
    if(!dompet){
        throw new NotFoundException(`Gopay dengan id ${id} tidak ditemukan`);
    }
    return dompet;
  }

  async createGopay(createGopayDto: CreateGopayDto, @Request() req){
    const dompet = await this.gopayRepository.createGopay(createGopayDto, req);
    if(dompet) {
      return{
        status: 201,
        message: 'Data Gopay berhasil dimasukkan',
        data:{
          id: dompet.id,
          nama_admin : dompet.user.nama_lengkap,
          nama: dompet.nama,
          nomor: dompet.nomor,
          jenis: dompet.jenis
        }
      }
    }
  }
 
  async updateGopay(id: string, updateGopayDto: UpdateGopayDto): Promise<any>{
    const { nama, nomor} = updateGopayDto;

    const gopay = await this.getGopayById(id);

    gopay.nama = nama;
    gopay.nomor = nomor;
    await gopay.save()

    if(gopay) {
      return{
        status: 201,
        message: 'Data gopay berhasil diupdate',
        data:{
          id: gopay.id,
          nama: gopay.nama,
          nomor: gopay.nomor
        }
      }
    }
  }

  async deleteGopay(id: string): Promise<any>{
    const result = await this.gopayRepository.delete(id);
    if (result.affected == 0){
        throw new NotFoundException(`Gopay dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 201,
      message: 'Data GOPAY berhasil dihapus'
    }
  }
}
