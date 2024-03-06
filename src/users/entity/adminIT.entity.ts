import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./users.entity";
import { Dana } from "src/wallet/dana/entities/dana.entity";


@Entity()
export class AdminIT extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, user => user.id, {onDelete:'CASCADE'})
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}