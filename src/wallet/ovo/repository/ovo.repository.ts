import { EntityRepository, Repository } from "typeorm";
import { LinkAja } from "../../link-aja/entities/linkaja.entity";
import { CreateLinkAjaDto } from '../../link-aja/dto/create-linkAja.dto';
import { InternalServerErrorException, Request } from "@nestjs/common";
import { Ovo } from '../entities/ovo.entity';
import { CreateOvoDto } from '../dto/create-ovo.dto';

@EntityRepository(Ovo)
export class OvoRepository extends Repository<Ovo>{
    async getAllOvo(): Promise<Ovo[]>{
        const query = this.createQueryBuilder('ovo');
        return await query.getMany();
    }

    async createOvo(createOvoDto: CreateOvoDto, @Request() req){
        const {nomor, nama} = createOvoDto;

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