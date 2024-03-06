import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Transaksi } from '../../transaksi/entities/transaksi.entity';

@Entity()
export class Pengguna extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => User, (user)=> user.id, {onDelete:'CASCADE'})
    @JoinColumn()
    user: User;
    
    // @Column({nullable: true})
    // foto_profil: string

    @Column({nullable:true})
    nomor_hp: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}