import { EntityRepository, Repository } from "typeorm";
import { Gopay } from "../entities/gopay.entity";
import { CreateGopayDto } from '../dto/create-gopay.dto';
import { InternalServerErrorException, Request } from "@nestjs/common";

@EntityRepository(Gopay)
export class GopayRepository extends Repository<Gopay>{
    async getAllGopay(): Promise<Gopay[]>{
        const query = this.createQueryBuilder('gopay');
        return await query.getMany();
    }

    async createGopay(createGopayDto: CreateGopayDto, @Request() req){
        const {nomor, nama} = createGopayDto;

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