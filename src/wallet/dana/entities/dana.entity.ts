import { Admin } from 'src/users/entity/admin.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../../users/entity/users.entity';
import { Transaksi } from '../../../transaksi/entities/transaksi.entity';

@Entity()
export class Dana extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: 'DANA'})
    jenis: string;

    @Column()
    nama: string;

    @Column()
    nomor: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn()
    user: User;

    // @ManyToOne(()=> Transaksi, (transaksi) => transaksi.dana)
    // transaksi: Transaksi;

}