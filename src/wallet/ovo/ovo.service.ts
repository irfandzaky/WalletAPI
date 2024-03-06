import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOvoDto } from './dto/create-ovo.dto';
import { UpdateOvoDto } from './dto/update-ovo.dto';
import { OvoRepository } from './repository/ovo.repository';
import { Ovo } from './entities/ovo.entity';

@Injectable()
export class OvoService {
  constructor(
    @InjectRepository(OvoRepository)
    private readonly ovoRepository: OvoRepository,
    private readonly jwtService: JwtService,
  ){}

  async getOvo(): Promise<Ovo[]>{
    return this.ovoRepository.getAllOvo();
  }

  async getOvoById(id: string): Promise<Ovo>{
    const dompet = await this.ovoRepository.findOne(id);
    if(!dompet){
        throw new NotFoundException(`Ovo dengan id ${id} tidak ditemukan`);
    }
    return dompet;
  }

  async createOvo(createOvoDto: CreateOvoDto, @Request() req){
    const dompet = await this.ovoRepository.createOvo(createOvoDto, req);
    if(dompet) {
      return{
        status: 201,
        message: 'Data Ovo berhasil dimasukkan',
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
 
  async updateOvo(id: string, updateOvoDto: UpdateOvoDto): Promise<any>{
    const { nama, nomor} = updateOvoDto;

    const ovo = await this.getOvoById(id);

    ovo.nama = nama;
    ovo.nomor = nomor;
    await ovo.save()

    if(ovo) {
      return{
        status: 201,
        message: 'Data OVO berhasil diupdate',
        data:{
          id: ovo.id,
          nama: ovo.nama,
          nomor: ovo.nomor
        }
      }
    }
  }

  async deleteOvo(id: string): Promise<any>{
    const result = await this.ovoRepository.delete(id);
    if (result.affected == 0){
        throw new NotFoundException(`Ovo dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 201,
      message: 'Data OVO berhasil dihapus'
    }
  }
}
