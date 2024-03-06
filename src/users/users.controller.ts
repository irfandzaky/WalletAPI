import { Body, Controller, Delete, Get, Param, PayloadTooLargeException, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import RoleGuard from 'src/auth/guard/roles.guard';
import { UUIDValidationPipe } from 'src/etc/pipes/uuid-validation.pipe';
import { User } from './entity/users.entity';
import Role from './entity/roles.enum';
import { CreatePenggunaDto } from './dto/create-pengguna.dto';
import { InjectUser } from 'src/etc/decorator/inject-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgetPasswordDto } from 'src/auth/dto/forget-password.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { updateEmailDto } from './dto/update-email.dto';
import { Request } from 'express';
import os from 'os';


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}

    // @Get('ip')
    // getClientIP(@Req() req: Request): void {
    // const clientIP = req.ip;
    // console.log(`Client IP: ${clientIP}`);
    // }

    @Get()
    @ApiOperation({ summary: 'Lihat Data User Keseluruhan', description: 'Penggunaan: <br> Login: AdminIT <br> Hak Akses: AdminIT' })
    @ApiResponse({ status: 200, description: 'Respon Berhasil'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @UseGuards(RoleGuard(Role.AdminIT))
    @UseGuards(JwtGuard)
    getAllUser(@InjectUser() user: User){
        return this.usersService.getAllUser();
    }

    @Get('pengguna')
    @ApiOperation({ summary: 'Lihat Data Pengguna', description: 'Penggunaan: <br> Login: AdminIT <br> Hak Akses: AdminIT' })
    @ApiResponse({ status: 200, description: 'Respon Berhasil'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @UseGuards(RoleGuard(Role.AdminIT))
    @UseGuards(JwtGuard)
    getPengguna(@InjectUser() user: User){
        return this.usersService.getPengguna();
    }
    
    @Get('/:id')
    @ApiOperation({ summary: 'Lihat Data User Berdasarkan id', description: 'Penggunaan: <br> Login: AdminIT <br> Hak Akses: AdminIT' })
    @ApiResponse({ status: 200, description: 'Respon Berhasil'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
    @ApiParam({ name: 'id', description: 'User ID yang akan ditampilkan' })
    @UseGuards(RoleGuard(Role.AdminIT))
    @UseGuards(JwtGuard)
    async getUser(@Param('id', UUIDValidationPipe) id: string): Promise<User>{
        return this.usersService.getUserById(id); 
    }

    @Get('getEmail/:email')
    @ApiOperation({ summary: 'Lihat Data Berdasarkan Email', description: 'Penggunaan: <br> Login: AdminIT <br> Hak Akses: AdminIT' })
    @ApiResponse({ status: 200, description: 'Respon Berhasil'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @ApiParam({ name: 'email', description: 'Alamat Email yang akan ditampilkan datanya' })
    @UseGuards(RoleGuard(Role.AdminIT))
    @UseGuards(JwtGuard)
    async getUserByEmail(@Param('email') email: string): Promise<User>{
        return this.usersService.getUserByEmail(email); 
    }

    @Post('register/admin')
    @ApiOperation({ summary: 'Mendaftar Akun Admin', description: 'Penggunaan: <br> Hanya admin sebelumnya yang dapat mendaftarkan admin baru <br> Hak Akses: Admin' })
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Email atau Password tidak valid'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @ApiBody({
        description: 'Isikan Nama Lengkap, Email, dan Password <br> Password minimal 8 kata dan maksimal 20 kata',
        type: CreateUserDto,
    })
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtGuard)
    async RegisterAdmin(@Body() payload: CreateUserDto){
        let role = 'Administrasi Keuangan';
        return this.usersService.RegisterAdmin(payload, role);
    }

    @Post('register/adminIT')
    @ApiOperation({ summary: 'Mendaftar Akun AdminIT', description: 'Penggunaan: <br> Hanya admin sebelumnya yang dapat mendaftarkan admin baru <br> Hak Akses: AdminIT' })
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Email atau Password tidak valid'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @ApiBody({
        description: 'Isikan Nama Lengkap, Email, dan Password <br> Password minimal 8 kata dan maksimal 20 kata',
        type: CreateUserDto,
    })
    @UseGuards(RoleGuard(Role.AdminIT))
    @UseGuards(JwtGuard)
    async RegisterAdminIT(@Body() payload: CreateUserDto){
        let role = 'Administrasi IT';
        return this.usersService.RegisterAdminIT(payload, role);
    }

    @Post('register/pengguna')
    @ApiOperation({ summary: 'Mendaftar Akun Pengguna'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Email atau Password tidak valid'})
    @ApiResponse({ status: 404, description: 'Masukkan Salah atau Tidak ditemukan'})
    @ApiBody({
        description: 'Isikan Nama Lengkap, Email, dan Password <br> Password minimal 8 kata dan maksimal 20 kata',
        type: CreateUserDto,
    })
    async RegisterPengguna(@Body() createUser: CreateUserDto){
        let role = 'Pengguna';
        return await this.usersService.RegisterPengguna(createUser, role);        
    }

    @Put('updateAdmin/:id')
    @ApiOperation({ summary: 'Memperbarui Data Admin', description: 'Penggunaan: <br> login: Admin <br> Hak Akses: Admin'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data tidak terisi'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtGuard)
    @ApiParam({ name: 'id', description: 'Masukkan user id yang akan diupdate' })
    @ApiBody({
        description: 'Isikan Posisi Baru Admin',
        type:CreateAdminDto
    })
    async accountSetupAdmin(
        @Param('id', UUIDValidationPipe) id: string, 
        @Body() payload: CreateAdminDto){
        return this.usersService.updateAdmin(id,payload);
    }

    // @Put('accountSetupPengguna/:id')
    // // @UseGuards(RoleGuard(Role.Pengguna))
    // @UseGuards(JwtGuard)
    // @UseInterceptors(FileInterceptor('foto_profil',{
    //     storage : diskStorage({
    //         destination : './asset/pengguna',
    //         filename : (req:any,file,cb) =>{
    //             const namafile = [req.user.id, Date.now()].join('-')
    //             cb(null,namafile+extname(file.originalname))
    //         }
    //     })
    // }))
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({type:CreatePenggunaDto})
    // async accountSetupPengguna(
    //     @Param('id', UUIDValidationPipe) id: string,
    //     @Body() payload: CreatePenggunaDto,
    //     @UploadedFile() foto_profil : Express.Multer.File){
    //     payload.foto_profil = foto_profil.filename;
    //     return this.usersService.accountSetupPengguna(id,payload);
    // }

    // @Put('updatePengguna/:id')
    // @UseGuards(RoleGuard(Role.Pengguna))
    // @UseGuards(JwtGuard)
    // @UseInterceptors(FileInterceptor('foto_profil',{
    //      storage : diskStorage({
    //          destination : './asset/pengguna',
    //          filename : (req:any,file,cb) =>{
    //              const namafile = [req.user.id,Date.now()].join('-')
    //              cb(null,namafile+extname(file.originalname))
    //          }
    //      })
    //  }))
    //  @ApiConsumes('multipart/form-data')
    // @ApiBody({type:updateUserDto})
    // async updatePengguna(
    //     @Param('id', UUIDValidationPipe) id: string,
    //     @Body() payload: updateUserDto){
    //      @UploadedFile() foto_profil: Express.Multer.File){
    //      if(foto_profil){
    //          payload.foto_profil = foto_profil.filename;
    //      }
    //     return this.usersService.updatePengguna(id, payload);
    // }

    @Put('updatePengguna/:id')
    @ApiOperation({ summary: 'Memperbarui Data Pengguna', description: 'Penggunaan: <br> login: Pengguna <br> Hak Akses: Pengguna'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data tidak terisi'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @UseGuards(RoleGuard(Role.Pengguna))
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('nomor_hp'))
    @ApiParam({ name: 'id', description: 'Masukkan user id yang akan diupdate' })
    @ApiBody({
        description: 'Isikan Nama Lengkap dan Nomor HP',
        type:updateUserDto
    })
    async updatePengguna(
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: updateUserDto){
        return this.usersService.updatePengguna(id, payload);
    }

    @Put('updateEmail/:id')
    @ApiOperation({ summary: 'Mengubah Email', description: 'Penggunaan: <br> login: Pengguna <br> Hak Akses: Admin'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @UseGuards(RoleGuard(Role.Pengguna))
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('nomor_hp'))
    @ApiParam({ name: 'id', description: 'Masukkan user id yang akan diganti emailnya' })
    @ApiBody({
        description: 'Isikan Email baru (tidak boleh sama dengan email sebelumnya atau yang telah terdaftar)',
        type:updateEmailDto
    })
    async updateEmail(
        @Param('id', UUIDValidationPipe) id: string,
        @Body() payload: updateEmailDto){
        return this.usersService.updateEmail(id, payload);
    }

    @Delete('/:id')
    @ApiOperation({ summary: 'Menghapus Data User', description: 'Penggunaan: <br> login: AdminIT <br> Hak Akses: AdminIT'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
    @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
    @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
    @ApiParam({ name: 'id', description: 'Masukkan user id yang akan dihapus datanya' })   
    @UseGuards(RoleGuard(Role.AdminIT))
    @UseGuards(JwtGuard)
    async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
        return this.usersService.deleteUser(id);
    }

    @Get('confirm/:id')
    @ApiOperation({ summary: 'Konfirmasi Email Setelah Mendaftar Akun', description: 'Menggunakan pihak ketiga Mailtrap atau Masukkan langsung user id pengguna'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
    @ApiParam({ name: 'id', description: 'Masukkan user id' })   
    async confirmEmail(@Param('id', UUIDValidationPipe) id: string) {
        const user = await this.usersService.getUserById(id);
        const userEmail = user.email;
        await this.usersService.confirmEmail(userEmail);
        return {
            status: 201,
            message: 'Konfirmasi email berhasil',
        }
    }

    @Put(':id/gantiPassword')
    @ApiOperation({ summary: 'Mengganti Password', description: 'Mengganti Password Setelah Login <br> login: semua <br> Hak akses: Semua'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
    @ApiParam({ name: 'id', description: 'Masukkan user id' })
    @UseGuards(JwtGuard)
    @ApiBody({
        description: 'Masukkan Password Baru dan Konfirmasi Password <br> Password minimal 8 kata dan maksimal 20 kata <br> Password baru dan Konfirmasi Password harus sama',
        type:ChangePasswordDto
    })
    async gantiPassword(
        @Param('id') id: string,
        @Body('currentPassword') currentPassword: string,
        @Body() payload: ChangePasswordDto): Promise<any> {
            await this.usersService.gantiPassword(id, currentPassword, payload);
            return {
                data: 201,
                message: 'Password berhasil diubah'
            }
    }

    @Post('forgetPassword')
    @ApiOperation({ summary: 'Lupa Password', description: 'Lupa Password dengan memasukkan email dilakukan sebelum login'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 404, description: 'Email tidak ditemukan atau salah'})
    @ApiBody({
        description: 'Masukkan email yang terdaftar',
        type:ForgetPasswordDto
    })
    async sendEmailForgetPassword(@Body() body: ForgetPasswordDto){
        const sendLink = await this.usersService.sendEmailForgetPasswordLink(body.email);
        return{
            statuscode: 201,
            message: 'Cek Email Anda Untuk Langkah Selanjutnya'
        }
    }

    @Post('resetPassword')
    @ApiOperation({ summary: 'Reset Password', description: 'Reset password untuk mengubah password sebelum login'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiBody({
        description: 'Masukkan password baru dan konfirmasi <br> token didapat dari email',
        type:ResetPasswordDto
    })
    async resetPassowrd(@Body() body: ResetPasswordDto){
        const email = await this.usersService.decodeConfirmationToken(body.token);
        return await this.usersService.resetPassword(email, body);
    }
    
    
    
    // @Delete(':id/hapusPhoto/:photoFileName')
    // async deleteFotoProfil(
    //     @Param('id', UUIDValidationPipe) id: string,
    //     @Param('photoFileName') photoFileName: string,
    // ): Promise<void> {
    //     return this.usersService.deletefotoProfil(id, photoFileName);
    // }
}
