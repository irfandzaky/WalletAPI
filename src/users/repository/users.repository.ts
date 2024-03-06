import { InternalServerErrorException, ConflictException, Logger, Request, BadRequestException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import * as bcrypt from 'bcrypt';
import { AdminRepository } from "./admin.repository";
import { FilterUserDto } from "../dto/filter-user.dto";
import { User } from "../entity/users.entity";
import { PenggunaRepository } from "./pengguna.repository";
import { updateUserDto } from '../dto/update-user.dto';


@EntityRepository(User)
export class UserRepository extends Repository<User>{
    private readonly penggunaRepository: PenggunaRepository
    private readonly adminRepository: AdminRepository

    async getAllUser(): Promise<User[]>{
        const query = this.createQueryBuilder('user');
        return await query.getMany();
    }

    async filterUsers(filter: FilterUserDto): Promise<User[]>{
        const { role } = filter;
        const query = this.createQueryBuilder('user');
        if(role){
            query.andWhere(`lower(user.role) LIKE: role`, {role: `%${role.toLowerCase()}%`,});
        }

        return await query.getMany();
    }

    async registerPengguna(createUserDto: CreateUserDto, role) {
        const {nama_lengkap, email, password} = createUserDto;
        
        const user = this.create();
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.nama_lengkap = nama_lengkap;
        user.email = email;
        user.role = role;

        const checkEmail = await this.findOne({where : {email : user.email}});
        if(checkEmail){
            throw new BadRequestException(`Email ${email} telah terdaftar`);
        }else{
            try{
                return await user.save();
            }catch(e){
                throw new InternalServerErrorException(e);
            }
        }
    }

    async registerAdmin(createUserDto: CreateUserDto, role) {
        const {nama_lengkap, email, password} = createUserDto;

        const user = this.create();
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.nama_lengkap = nama_lengkap;
        user.email = email;
        user.role = role;

        const checkEmail = await this.findOne({where : {email : user.email}});
        if(checkEmail){
            throw new BadRequestException(`Email ${email} telah terdaftar`);
        }else{
            try{
                return await user.save();
            }catch(e){
                throw new InternalServerErrorException(e);
            }
        }
    }

    async registerAdminIT(createUserDto: CreateUserDto, role) {
        const {nama_lengkap, email, password} = createUserDto;

        const user = this.create();
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(password, user.salt);
        user.nama_lengkap = nama_lengkap;
        user.email = email;
        user.role = role;

        const checkEmail = await this.findOne({where : {email : user.email}});
        if(checkEmail){
            throw new BadRequestException(`Email ${email} telah terdaftar`);
        }else{
            try{
                return await user.save();
            }catch(e){
                throw new InternalServerErrorException(e);
            }
        }
    }

    async validateUser(email: string, password: string): Promise<User>{
        const userEmail = await this.findOne({ email });
        if(userEmail && (await userEmail.validatePassword(password))){
            return userEmail;
        }
        return null;
    }
}