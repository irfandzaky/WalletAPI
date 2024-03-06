import { InternalServerErrorException, Request } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateDanaDto } from "../dto/create-dana.dto";
import { Dana } from "../entities/dana.entity";


@EntityRepository(Dana)
export class DanaRepository extends Repository<Dana>{

    async getAllDana(): Promise<Dana[]>{
        const query = this.createQueryBuilder('dana');
        return await query.getMany();
    }

    async createDana(createDanaDto: CreateDanaDto, @Request() req){
        const {nomor, nama} = createDanaDto;

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