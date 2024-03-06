import { Body, Controller, Param, Patch, Post, UseGuards, Request, Delete, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { refreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LoginResponse } from './interface/login-response.interface';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { JwtGuard } from './guard/jwt.guard';
import { UUIDValidationPipe } from 'src/etc/pipes/uuid-validation.pipe';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController { 
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ){}

    @Post('login/admin')
    @ApiOperation({ summary: 'Login Admin'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiBody({
        description: 'Masukkan Email dan Password yang terdaftar',
        type:LoginDto
    })
    async loginAdmin(@Body() LoginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.loginAdmin(LoginDto);
    }

    @Post('login/pengguna')
    @ApiOperation({ summary: 'Login Pengguna'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiBody({
        description: 'Masukkan Email dan Password yang terdaftar',
        type:LoginDto
    })
    async loginPengguna(@Body() LoginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.loginPengguna(LoginDto);
    }

    @Post('login/adminIT')
    @ApiOperation({ summary: 'Login AdminIT'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiBody({
        description: 'Masukkan Email dan Password yang terdaftar',
        type:LoginDto
    })
    async loginAdminIT(@Body() LoginDto: LoginDto): Promise<LoginResponse>{
        return this.authService.loginAdminIT(LoginDto);
    }

    @Post('refreshToken')
    @ApiOperation({ summary: 'Memperbarui Akses Token'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
    @ApiBody({
        description: 'Masukkan akses token',
        type:refreshAccessTokenDto
    })
    async refreshToken(@Body() refreshTokenDto: refreshAccessTokenDto): Promise<{ access_token: string }>{
        return this.authService.refreshAccessToken(refreshTokenDto);
    }

    @Patch('/:id/revoke')
    @ApiOperation({ summary: 'Revoke Token/Logout', description: 'Me-revoke token yg sudah ada agar pengguna logout <br> login: semua'})
    @ApiResponse({ status: 201, description: 'Respon Berhasil'})
    @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
    @ApiParam({ name: 'id', description: 'Masukkan id token' })
    @UseGuards(JwtGuard)
    async revokeRefreshToken(@Param('id') id: string): Promise<void>{
        return this.authService.revokeRefreshToken(id);
    }

    // @Post('forgetPassword')
    // async sendEmailForgetPassword(@Body() body: ForgetPasswordDto){
    //     const sendLink = await this.usersService.sendEmailForgetPasswordLink(body.email);
    //     return{
    //         statuscode: 201,
    //         message: 'Cek Email Anda Untuk Langkah Selanjutnya'
    //     }
    // }

    // @Post('resetPassword')
    // async resetPassowrd(@Body() body: ResetPasswordDto){
    //     const email = await this.usersService.decodeConfirmationToken(body.token);
    //     return await this.usersService.resetPassword(email, body);
    // }

    // @Delete('delete/:id')
    // @UseGuards(JwtGuard)
    // async deleteToken(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
    //     return this.authService.deleteToken(id);
    // }

}
