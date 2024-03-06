import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-response.interface';
import { RefreshTokenRepository } from './repository/refresh-token.repository';
import { TokenExpiredError } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { refrestTokenConfig } from 'src/etc/config/jwt.config';
import { User } from 'src/users/entity/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, 
        private readonly usersService: UsersService,
        @InjectRepository(RefreshTokenRepository)
        private readonly refreshTokenRepository: RefreshTokenRepository,
    ){}

    async loginAdmin(LoginDto: LoginDto): Promise<LoginResponse>{
        const {email, password } = LoginDto;

        const user = await this.usersService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException('Email atau Password salah');
        }
        if(user.role != `Administrasi Keuangan`){
            throw new UnauthorizedException('Anda Tidak Memiliki Akses');
        }

        if(user) {
            const valid = this.usersService.compare(password, user.password);
            if(valid){
                const payload = { email: user.email, sub: user.id};

                const access_token = await this.createAccessToken(user); 
                const refresh_token = await this.createRefreshToken(user);

                return{
                    status: 201,
                    message: `Berhasil Login Sebagai Administrasi Keuangan`,
                    access_token,
                    refresh_token
                } as LoginResponse;
            } else {
                throw new UnauthorizedException("Password Tidak Cocok")
            }
        }
    }

    async loginAdminIT(LoginDto: LoginDto): Promise<LoginResponse>{
        const {email, password } = LoginDto;

        const user = await this.usersService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException('Email atau Password salah');
        }
        if(user.role != `Administrasi IT`){
            throw new UnauthorizedException('Anda Tidak Memiliki Akses');
        }

        if(user) {
            const valid = this.usersService.compare(password, user.password);
            if(valid){
                const payload = { email: user.email, sub: user.id};

                const access_token = await this.createAccessToken(user); 
                const refresh_token = await this.createRefreshToken(user);

                return{
                    status: 201,
                    message: `Berhasil Login Sebagai Administrasi IT`,
                    access_token,
                    refresh_token
                } as LoginResponse;
            } else {
                throw new UnauthorizedException("Password Tidak Cocok")
            }
        }
    }

    async loginPengguna(LoginDto: LoginDto): Promise<LoginResponse>{
        const { email, password } = LoginDto;

        const user = await this.usersService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException('Email atau Password salah');
        }
        if(user.role != `Pengguna`){
            throw new UnauthorizedException('Anda Tidak Memiliki Akses');
        }

        if(user) {
            const valid = this.usersService.compare(password, user.password);
            if(valid){
                const check = await this.usersService.checkVerifiedEmail(user.email);
                if(check){
                    const payload = { email: user.email, sub: user.id};

                    const access_token = await this.createAccessToken(user); 
                    const refresh_token = await this.createRefreshToken(user);

                    return{
                        status: 201,
                        message: `Berhasil Login Sebagai Pengguna`,
                        access_token,
                        refresh_token
                    } as LoginResponse;
                } else {
                    throw new UnauthorizedException("Silahkan Cek Email Anda Terlebih Dahulu, Kami telah Mengirimkan Link Verifikasi Ke Email Anda")
                }
            }
        }
    }

    async refreshAccessToken(refreshTokenDto: refreshAccessTokenDto): Promise<{ access_token: string }>{
        const{ refresh_token } = refreshTokenDto;
        const payload = await this.decodeToken(refresh_token);
        const refreshToken = await this.refreshTokenRepository.findOne(payload.jid, { relations: ['user'] });

        if(!refreshToken){
            throw new UnauthorizedException(`Refresh token tidak ditemukan`);
        }

        if(refreshToken.isRevoked){
            throw new UnauthorizedException(`Refresh token telah di revoke`);
        }

        const access_token = await this.createAccessToken(refreshToken.user);
        return { access_token };
    }

    async decodeToken(token: string): Promise<any>{
        try{
            return await this.jwtService.verifyAsync(token);
        }catch(e){
            if(e instanceof TokenExpiredError){
                throw new UnauthorizedException(`Refresh Token telah kadaluarsa`);
            } else{
                throw new InternalServerErrorException(`Failed To Decode Token`);
            }
        }
    }

    async createAccessToken(user: User): Promise<string>{
        const payload = {
            sub: user.id
        };
        const access_token = await this.jwtService.signAsync(payload);
        return access_token;
    }

    async createRefreshToken(user: User): Promise<string>{
        const refreshToken = await this.refreshTokenRepository.createRefreshToken(user, 
            +refrestTokenConfig.expiresIn
        );

        const payload = {
            jid: refreshToken.id,
        };

        const refresh_token = await this.jwtService.signAsync(payload, refrestTokenConfig)
        return refresh_token;
        ;
    }

    async revokeRefreshToken(id: string): Promise<any>{
        const refrestToken = await this.refreshTokenRepository.findOne(id);
        if(!refrestToken){
            throw new NotFoundException(`Refresh token tidak ditemukan`);
        }
        refrestToken.isRevoked = true;
        await refrestToken.save();
        
        return {
            status: 201,
            message: 'Token berhasil direvoke',
          }
    }

    // async deleteToken(id: string): Promise<void>{
    //     const result = await this.refreshTokenRepository.delete(id);
    //     if (result.affected == 0){
    //         throw new NotFoundException(`User with id ${id} not found`);
    //     }
    // }

    
}
