import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entity/users.entity';
import { Transaksi } from '../../transaksi/entities/transaksi.entity';

@Entity()
export class Refund extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(()=> Transaksi, (transaksi) => transaksi.id, {onDelete:'CASCADE'})
    @JoinColumn()
    transaksi: Transaksi;

    @ManyToOne(()=> User, (user) => user.id, {onDelete:'CASCADE' })
    @JoinColumn()
    user: User;

    @Column()
    tanggal_transaksi: string;

    @Column()
    jumlah_transaksi: number;

    @Column()
    jenis_wallet: string;

    @Column()
    nomor_wallet: string;

    @Column()
    nama_wallet: string;

    @Column()
    alasan: string;

    @Column()
    bukti_refund: string;

    @Column()
    status_refund: string;

    @CreateDateColumn()
    create_at: Date;
}