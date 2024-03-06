import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminRepository } from './repository/admin.repository';
import { AdminITRepository } from './repository/adminIT.repository';
import { CreateAdminDto } from './dto/create-admin.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import EmailService from 'src/etc/email/email.service';
import { User } from './entity/users.entity';
import { PenggunaRepository } from './repository/pengguna.repository';
import { CreatePenggunaDto } from './dto/create-pengguna.dto';
import * as fs from 'fs/promises';
import { ChangePasswordDto } from './dto/change-password.dto';
import axios from 'axios';
import { updateEmailDto } from './dto/update-email.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository) 
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService,
        private readonly adminRepository: AdminRepository,
        private readonly adminITRepository: AdminITRepository,
        private readonly penggunaRepository: PenggunaRepository,
    ) {}
    
    async getAllUser(): Promise<User[]>{
        return await this.userRepository.getAllUser();
    }

    async checkVerifiedEmail(email: string) {
        const verified = await this.userRepository.findOne({ where: { email } });
    
        if (verified.emailVerified) {
          return true;
        } else {
          return false
        }
      }

    async EmailHasBeenConfirmed(email: string) {
        return this.userRepository.update({ email }, {
            emailVerified: true
        });
    }

    async getByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async getPengguna(): Promise<User[]> {
      return this.userRepository.find({ where: { role : 'Pengguna' } });
    }

    async getUserById(id: string): Promise<User>{
        const user = await this.userRepository.findOne(id);
        if(!user){
            throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
        }
        return user;
    }

    async getUserByEmail(email: string): Promise<User>{
      const user = await this.userRepository.findOne({email});
      if(!user){
          throw new NotFoundException(`Email ${email} tidak ditemukan/terdaftar`);
      }
      return user;
  }


    async filterUsers(filter: FilterUserDto): Promise<User[]>{
      return await this.userRepository.filterUsers(filter);
    }
    
    async findUserById(id: string): Promise<User>{
        return await this.userRepository.findOne(id);
    }

    async RegisterAdmin(createUserDto: CreateUserDto, role){
      const user = await this.userRepository.registerAdmin(createUserDto, role);
      if(user){
        const admin = await this.adminRepository.createAdmin(user);
        return {
           status: 201,
           message: 'Berhasil mendaftar akun',
           data: {
             id: user.id,
             nama_lengkap: user.nama_lengkap,
             email: user.email,
             role: user.role
           }
         }
       }
    }

    async RegisterAdminIT(createUserDto: CreateUserDto, role){
      const user = await this.userRepository.registerAdminIT(createUserDto, role);
      if(user){
        const adminIT = await this.adminITRepository.createAdminIT(user);
        return {
           status: 201,
           message: 'Berhasil mendaftar akun',
           data: {
             id: user.id,
             nama_lengkap: user.nama_lengkap,
             email: user.email,
             role: user.role
           }
         }
       }
    }

    async RegisterPengguna(createUserDto: CreateUserDto, role){
      const user = await this.userRepository.registerPengguna(createUserDto, role)
      const sendLink = await this.sendVerificationLink(user.email, user.id);
      if(user){
       const pengguna = await this.penggunaRepository.createPengguna(user);
       return {
          status: 201,
          message: 'Berhasil mendaftarkan akun',
          data: {
            id: user.id,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            role: user.role
          }
        }
      }
    }

    async updateAdmin(id: string, createAdmin: CreateAdminDto){
        const { posisi } = createAdmin;
        const user = await this.getUserById(id);
        user.admin.posisi = posisi;

        await user.admin.save();
        return{
          status: 201,
          message: 'Berhasil memperbarui akun',
          data: {
            id: user.id,
            posisi: user.admin.posisi
            }
        }
    }

    // async accountSetupPengguna(id: string, createPengguna: CreatePenggunaDto){
    //   const { nama_lengkap, foto_profil } = createPengguna;
    //   const user = await this.getUserById(id);
    //   user.pengguna.nama_lengkap = nama_lengkap;
    //   user.pengguna.foto_profil = foto_profil;

    //   await user.pengguna.save();
    // }

    async updatePengguna(id: string, updateUserDto: updateUserDto){
      const { nama_lengkap, nomor_hp} = updateUserDto;
      const user = await this.getUserById(id);
      user.nama_lengkap = nama_lengkap;
      await user.save();

      user.pengguna.nomor_hp = nomor_hp;
      user.pengguna.save();
      
      return{
        status: 201,
          message: 'Berhasil memperbarui akun',
          data: {
            id: user.id,
            nama_lengkap: user.nama_lengkap,
            nomor_hp: user.pengguna.nomor_hp,
          }
      }
    }

    async updateEmail(id: string, updateEmailDto: updateEmailDto){
      const { email } = updateEmailDto;
      const user = await this.getUserById(id);
      user.email = email;

      const checkEmail = await this.userRepository.findOne({where : {email : user.email}});
        if(checkEmail){
            throw new BadRequestException(`Email ${email} telah terdaftar`);
        }else{
            try{
                await user.save();
                return{
                  status: 201,
                  message: 'Berhasil memperbarui email',
                    data: {
                      id: user.id,
                      email: user.email,
                    }
                }
            }catch(e){
                throw new InternalServerErrorException(e);
            }
        }
    }
  
    async deleteUser(id: string): Promise<any>{
        const result = await this.userRepository.delete(id);
        if (result.affected == 0){
            throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
        }
        return {
          status: 201,
          message: 'User berhasil dihapus',
        }
    }

    async validateUser(email: string, password: string): Promise<User>{
        return await this.userRepository.validateUser(email, password);
    }

    sendVerificationLink(email: string, id: string) {
        const url = `${process.env.EMAIL_CONFIRMATION_URL}${id}`;

        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Verifikasi Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    background-color: #fff;
                    border: 1px solid #e1e1e1;
                    border-radius: 5px;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
        
                h1 {
                    color: #333;
                    text-align: center;
                }
        
                p {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                }
        
                .verification-link {
                    background-color: #007bff;
                    color: #fff;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    display: inline-block;
                    margin: 20px auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Verifikasi Email </h1>
                <p>Terimakasih telah mendaftar, silahkan lakukan verifikasi email dengan klik tomobol dibawah ini .</p>
                <a class="verification-link" href="${url}">Verifikasi Email</a>
                <p>Jika tombol tidak dapat diklik, silahkan salin dan tempel tautan dibawah ke browser anda   </p>
                <p>${url}</p>
                <p>Terimakasih banyak</p>
            </div>
        </body>
        </html>
        `;
    
        const text = `Terimakasih telah melakukan pendaftaran pada kliring, silahkan klik link berikut untuk melanjutkan: ${url}`;
    
        return this.emailService.sendMail({
          from: 'emailtesting@gmail.com',
          to: email,
          subject: 'Verifikasi Email',
          html: emailHTML,
        })
    }

    async decodeConfirmationToken(token: string) {
      try {
        const payload = await this.jwtService.verify(token, {
          secret: 'kodekliring',
        });
  
        if (typeof payload === 'object' && 'email' in payload) {
          return payload.email;
        }
        throw new BadRequestException();
      } catch (error) {
        if (error?.name === 'TokenExpiredError') {
          throw new BadRequestException('Token konfirmasi telah kadaluarsa');
        }
        throw new BadRequestException('Bad confirmation token');
      }
    }

    async confirmEmail(email: string) {
        const user = await this.getByEmail(email);
        if (user.emailVerified) {
          throw new BadRequestException('Email sudah dikonfirmasi sebelumnya');
        } else {
          const confirm = await this.EmailHasBeenConfirmed(email);
        }
    }

    async sendEmailForgetPasswordLink(email: string){
      const user = await this.getByEmail(email);
      if(!user){
        throw new BadRequestException('Email Tidak Ditemukan');
      } else{
        const payload = { 
          email: email,
        };
        const token = this.jwtService.sign(payload);
        const url = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
        const text = `kami baru saja menemukan jika anda berkeingin untuk reset password, silahkan klik link berikut untuk mereset password anda ${url}`;

        // try {
        //   await axios.post('http://localhost:3000/users/resetPassword', {
        //     token: token,
        //     newPassword: 'user1234gantikali',
        //     confirmNewPassword: 'user1234gantikali'
        //   });
    
        //   console.log('Password berhasil diubah');
        // } catch (error) {
        //   console.error('Password reset failed', error.response.data);
        // }

        const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Kata Sandi</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }

            .container {
              background-color: #fff;
              border: 1px solid #e1e1e1;
              border-radius: 5px;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }

            h1 {
              color: #333;
              text-align: center;
            }

            p {
              color: #555;
              font-size: 16px;
              line-height: 1.6;
            }

            textarea {
              width: 100%;
              height: 100px;
              border: 1px solid #ccc;
              border-radius: 5px;
              padding: 10px;
            }

            .verification-link {
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
              display: inline-block;
              margin: 20px auto;
          }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Reset Kata Sandi</h1>
            <p> Silahkan klik link dibawah ini untuk melakukan reset password  </p>
            <a class="verification-link" href="${url}">Reset Password</a>
            <p> untuk kebutuhan pengembangan dan testing, silahkan salin token berikut dan masukkan ke kolom token reset kata sandi</p>
              <textarea readonly>${token}</textarea>
          </div>
        </body>
        </html>
        `;

        return this.emailService.sendMail({
          to: email,
          subject: `Reset Password`,
          text,
          html: emailHTML
        })
      }
    }

    async resetPassword(email: string, ResetPasswordDto): Promise<any>{
      const { newPassword, confirmNewPassword  } = ResetPasswordDto;

      if (newPassword !== confirmNewPassword) {
        throw new BadRequestException('Password baru dan konfirmasi password tidak cocok');
      }

      const user = await this.getByEmail(email);
      user.salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(newPassword, user.salt);

      await user.save();

      return {
        status: 201,
        message: 'Password berhasil diubah',
      }
    }

    hash(plainPassword){
      const salt = bcrypt.genSalt();
      const hash = bcrypt.hashSync(plainPassword, parseInt(salt))
      return hash; 
    }

    compare(plainPassword, hash){
      const valid = bcrypt.compareSync(plainPassword, hash);
      return valid;
    }

    async gantiPassword(id: string, currentPassword: string, changePasswordDto: ChangePasswordDto): Promise<any>{
      const user = await this.userRepository.findOne(id);
      if (!user) {
        throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new BadRequestException('Password sebelumnya salah');
      }

      if (changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword){
        throw new BadRequestException('Password baru dan Konfirmasi password tidak cocok');
      }

      const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, user.salt);
      await this.userRepository.update(id, { password: hashedPassword });

      return {
        status: 201,
        message: 'Password berhasil diubah',
      }
    }

    // async deletefotoProfil(id: string, photoFileName: string): Promise<void>{
    //   const deleteFotoProfil = './asset/pengguna/${id}/${photoFileName}';
    //   try {
    //     await fs.unlink(deleteFotoProfil);
    //   } catch (error) {
    //     throw new Error('Gagal menghapus photo profil: ${error.message}');
    //   }
    // }

    // generateRandomToken(): string {
    //   const token = Math.floor(1000 + Math.random() * 9000).toString();
    //   this.usedTokens.add(token);
    //   return token;
    // }

    // validateAndConsumeToken(token: string): void {
    //   if (this.usedTokens.has(token)) {
    //     this.usedTokens.delete(token);
    //   } else {
    //     throw new NotFoundException('Token tidak valid atau sudah digunakan.');
    //   }
    // }
    
}
