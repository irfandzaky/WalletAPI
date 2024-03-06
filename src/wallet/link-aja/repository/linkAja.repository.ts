import { EntityRepository, Repository } from "typeorm";
import { LinkAja } from "../entities/linkaja.entity";
import { CreateLinkAjaDto } from '../dto/create-linkAja.dto';
import { InternalServerErrorException, Request } from "@nestjs/common";

@EntityRepository(LinkAja)
export class LinkAjaRepository extends Repository<LinkAja>{
    async getAllLinkAja(): Promise<LinkAja[]>{
        const query = this.createQueryBuilder('linkAja');
        return await query.getMany();
    }

    async createLinkAja(createLinkAjaDto: CreateLinkAjaDto, @Request() req){
        const {nomor, nama} = createLinkAjaDto;

        const dompet = this.create();
        dompet.user = req;
        dompet.nomor = nomor;
        dompet.nama = nama;

        try{
            return await dompet.save()
        }catch(e){
            throw new InternalServerErrorException(e);
        }

    }
}