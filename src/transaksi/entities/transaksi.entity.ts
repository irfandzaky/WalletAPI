import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entity/users.entity';
import { Pengguna } from '../../users/entity/pengguna.entity';
import { Dana } from 'src/wallet/dana/entities/dana.entity';
import { Refund } from '../../refund/entities/refund.entity';

@Entity()
export class Transaksi extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(()=> User, (user) => user.id, {onDelete:'CASCADE'})
    @JoinColumn()
    user: User;

    @Column()
    tujuan: string;

    @Column()
    nomor_tujuan: string;

    @Column()
    nama_akun: string;
    
    @Column()
    jumlah: number;

    @Column()
    catatan: string;

    @Column()
    metode_bayar: string;

    @Column()
    kode_unik: number;

    @Column()
    total: number;

    @Column({nullable: true})
    bukti: string;

    @Column()
    status: string;

    @CreateDateColumn()
    create_at: Date

    @OneToOne(() => Refund, (refund) => refund.transaksi, {onDelete:'CASCADE', eager: true})
    refund: Refund;

    // @OneToMany(()=> Dana, (dana) => dana.id)
    // dana: Dana;
}
