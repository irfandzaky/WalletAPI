import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Admin } from "./admin.entity";
import { AdminIT } from "./adminIt.entity";
import { RefreshToken } from "src/auth/entity/refresh-token.entity";
import { Pengguna } from "./pengguna.entity";
import { Gopay } from '../../wallet/gopay/entities/gopay.entity';
import { Dana } from "src/wallet/dana/entities/dana.entity";
import { LinkAja } from '../../wallet/link-aja/entities/linkaja.entity';
import { Ovo } from '../../wallet/ovo/entities/ovo.entity';
import { Shopeepay } from '../../wallet/shopeepay/entities/shopeepay.entity';
import { Transaksi } from "src/transaksi/entities/transaksi.entity";
import { Refund } from "src/refund/entities/refund.entity";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    nama_lengkap: string

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column()
    role: string;

    @Column({ default: false })
    emailVerified: boolean;

    @CreateDateColumn()
    create_at: Date;

    @UpdateDateColumn() 
    update_at: Date;

    @OneToOne(() => Pengguna, (pengguna) => pengguna.user, {onDelete:'CASCADE', eager:true})
    pengguna: Pengguna;

    @OneToOne(() => Admin, (admin) => admin.user, {onDelete:'CASCADE', eager: true})
    admin: Admin;

    @OneToOne(() => AdminIT, (adminIT) => adminIT.user, {onDelete:'CASCADE', eager: true})
    adminIT: AdminIT;

    @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {onDelete:'CASCADE', eager: true })
    refreshToken: RefreshToken[];

    async validatePassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }

    @OneToMany(()=> Dana, (dana) => dana.user)
    dana: Dana[];

    @OneToMany(()=> Gopay, (gopay) => gopay.user)
    gopay: Gopay[];

    @OneToMany(()=> LinkAja, (linkAja) => linkAja.user)
    linkAja: LinkAja[];

    @OneToMany(()=> Ovo, (ovo) => ovo.user)
    ovo: Ovo[];

    @OneToMany(()=> Shopeepay, (shopeepay) => shopeepay.user)
    shopeepay: Shopeepay[];

    @OneToMany(()=> Transaksi, (transaksi) => transaksi.user, {onDelete:'CASCADE'})
    transaksi: Transaksi[];

    @OneToMany(()=> Refund, (refund) => refund.user, {onDelete:'CASCADE'})
    refund: Refund[];
}

