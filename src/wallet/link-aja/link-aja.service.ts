import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLinkAjaDto } from './dto/create-linkAja.dto';
import { UpdateLinkAjaDto } from './dto/update-link-aja.dto';
import { LinkAjaRepository } from './repository/linkAja.repository';
import { LinkAja } from './entities/linkaja.entity';

@Injectable()
export class LinkAjaService {
  constructor(
    @InjectRepository(LinkAjaRepository)
    private readonly linkAjaRepository: LinkAjaRepository,
    private readonly jwtService: JwtService,
  ){}

  async getLinkAja(): Promise<LinkAja[]>{
    return this.linkAjaRepository.getAllLinkAja();
  }

  async getLinkAjaById(id: string): Promise<LinkAja>{
    const dompet = await this.linkAjaRepository.findOne(id);
    if(!dompet){
        throw new NotFoundException(`LinkAja dengan id ${id} tidak ditemukan`);
    }
    return dompet;
  }

  async createLinkAja(createLinkAjaDto: CreateLinkAjaDto, @Request() req){
    const dompet = await this.linkAjaRepository.createLinkAja(createLinkAjaDto, req);
    if(dompet) {
      return{
        status: 201,
        message: 'Data LinkAja berhasil dimasukkan',
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
 
  async updateLinkAja(id: string, updateLinkAjaDto: UpdateLinkAjaDto): Promise<any>{
    const { nama, nomor} = updateLinkAjaDto;

    const linkAja = await this.getLinkAjaById(id);

    linkAja.nama = nama;
    linkAja.nomor = nomor;
    await linkAja.save()

    if(linkAja) {
      return{
        status: 201,
        message: 'Data LinkAja berhasil diupdate',
        data:{
          id: linkAja.id,
          nama: linkAja.nama,
          nomor: linkAja.nomor
        }
      }
    }
  }

  async deleteLinkAja(id: string): Promise<any>{
    const result = await this.linkAjaRepository.delete(id);
    if (result.affected == 0){
        throw new NotFoundException(`LinkAja dengan id ${id} tidak ditemukan`);
    }
    return {
      status: 201,
      message: 'Data LinkAja berhasil dihapus'
    }
  }
}
