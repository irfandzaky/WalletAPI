import { Admin } from 'src/users/entity/admin.entity';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../../users/entity/users.entity';

@Entity()
export class LinkAja extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: 'LinkAja'})
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
}