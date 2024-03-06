import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDanaDto } from './dto/create-dana.dto';
import { UpdateDanaDto } from './dto/update-dana.dto';
import { DanaRepository } from './repository/dana.repository';
import { Dana } from './entities/dana.entity';

@Injectable()
export class DanaService {
  constructor(
    @InjectRepository(DanaRepository)
    private readonly danaRepository: DanaRepository,
    private readonly jwtService: JwtService,
  ){}

  async getDana(): Promise<Dana[]>{
    return this.danaRepository.getAllDana();
  }

  async getDanaById(id: string): Promise<Dana>{
    const dompet = await this.danaRepository.findOne(id);
    if(!dompet){
        throw new NotFoundException(`Dana dengan id ${id} tidak ditemukan`);
    }
    return dompet;
  }

  async createDana(createDanaDto: CreateDanaDto, @Request() req){
    const dompet = await this.danaRepository.createDana(createDanaDto, req);
    if(dompet) {
      return{
        status: 201,
        message: 'Data Dana berhasil dimasukkan',
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
 
  async updateDana(id: string, updateDanaDto: UpdateDanaDto): Promise<any>{
    const { nama, nomor} = updateDanaDto;

    const dana = await this.getDanaById(id);

    dana.nama = nama;
    dana.nomor = nomor;
    await dana.save()

    if(dana) {
      return{
        status: 201,
        message: 'Data Dana berhasil diupdate',
        data:{
          id: dana.id,
          nama: dana.nama,
          nomor: dana.nomor
        }
      }
    }
    
  }

  async deleteDana(id: string): Promise<any>{
    const result = await this.danaRepository.delete(id);
    if (result.affected == 0){
        throw new NotFoundException(`Dana dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 201,
      message: 'Data DANA berhasil dihapus'
    }
  }
}
