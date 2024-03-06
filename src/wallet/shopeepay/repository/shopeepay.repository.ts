import { EntityRepository, Repository } from "typeorm";
import { LinkAja } from "../../link-aja/entities/linkaja.entity";
import { CreateLinkAjaDto } from '../../link-aja/dto/create-linkAja.dto';
import { InternalServerErrorException, Request } from "@nestjs/common";
import { Shopeepay } from '../entities/shopeepay.entity';
import { CreateShopeepayDto } from '../dto/create-shopeepay.dto';

@EntityRepository(Shopeepay)
export class ShopeepayRepository extends Repository<Shopeepay>{
    async getAllShopeepay(): Promise<Shopeepay[]>{
        const query = this.createQueryBuilder('shopeepay');
        return await query.getMany();
    }

    async createShopeepay(createShopeepayDto: CreateShopeepayDto, @Request() req){
        const {nomor, nama} = createShopeepayDto;

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