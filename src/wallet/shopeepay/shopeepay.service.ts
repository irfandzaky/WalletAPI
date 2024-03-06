import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShopeepayDto } from './dto/create-shopeepay.dto';
import { UpdateShopeepayDto } from './dto/update-shopeepay.dto';
import { ShopeepayRepository } from './repository/shopeepay.repository';
import { Shopeepay } from './entities/shopeepay.entity';

@Injectable()
export class ShopeepayService {
  constructor(
    @InjectRepository(ShopeepayRepository)
    private readonly shopeepayRepository: ShopeepayRepository,
    private readonly jwtService: JwtService,
  ){}

  async getShopeepay(): Promise<Shopeepay[]>{
    return this.shopeepayRepository.getAllShopeepay();
  }

  async getShopeepayById(id: string): Promise<Shopeepay>{
    const dompet = await this.shopeepayRepository.findOne(id);
    if(!dompet){
        throw new NotFoundException(`Shopeepay dengan id ${id} tidak ditemukan`);
    }
    return dompet;
  }

  async createShopeepay(createShopeepayDto: CreateShopeepayDto, @Request() req){
    const dompet = await this.shopeepayRepository.createShopeepay(createShopeepayDto, req);
    if(dompet) {
      return{
        status: 201,
        message: 'Data Shopeepay berhasil dimasukkan',
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
 
  async updateShopeepay(id: string, updateShopeepayDto: UpdateShopeepayDto): Promise<any>{
    const { nama, nomor} = updateShopeepayDto;

    const shopeepay = await this.getShopeepayById(id);

    shopeepay.nama = nama;
    shopeepay.nomor = nomor;
    await shopeepay.save()

    if(shopeepay) {
      return{
        status: 201,
        message: 'Data Shopeepay berhasil diupdate',
        data:{
          id: shopeepay.id,
          nama: shopeepay.nama,
          nomor: shopeepay.nomor
        }
      }
    }
  }

  async deleteShopeepay(id: string): Promise<any>{
    const result = await this.shopeepayRepository.delete(id);
    if (result.affected == 0){
        throw new NotFoundException(`Shopeepay dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 201,
      message: 'Data Shopeepay berhasil dihapus'
    }
  }
}
