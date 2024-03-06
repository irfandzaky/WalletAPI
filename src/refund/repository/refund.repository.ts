import { EntityRepository, Repository } from 'typeorm';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';
import { CreateTransaksiDto } from '../../transaksi/dto/create-transaksi.dto';
import { InternalServerErrorException, Request } from '@nestjs/common';
import { FilterMetodeBayar } from '../../transaksi/dto/filter-metode-bayar.dto';
import { Refund } from '../entities/refund.entity';
import { RefundDto } from '../dto/refund.dto';

@EntityRepository(Refund)
export class RefundRepository extends Repository<Refund>{
    async createRefund(transaksi: Transaksi, @Request() req){
        const refund = this.create();
        refund.user = req;
        refund.transaksi = transaksi;

        return await refund.save();
    }

    async getAllRefund(): Promise<Refund[]>{
        const query = this.createQueryBuilder('refund');
        return await query.getMany();
    }
}