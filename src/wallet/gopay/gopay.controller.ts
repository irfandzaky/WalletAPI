import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { GopayService } from './gopay.service';
import { CreateGopayDto } from './dto/create-gopay.dto';
import { UpdateGopayDto } from './dto/update-gopay.dto';
import { InjectGopay } from 'src/etc/decorator/inject-gopay.decorator';
import { Gopay } from './entities/gopay.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from '../../etc/pipes/uuid-validation.pipe';
import RoleGuard from 'src/auth/guard/roles.guard';
import Role from 'src/users/entity/roles.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Gopay')
@ApiBearerAuth()
@Controller('gopay')
export class GopayController {
  constructor(private readonly gopayService: GopayService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat Data Keseluruhan E-wallet Gopay', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllDana(@InjectGopay() gopay: Gopay){
    return this.gopayService.getGopay();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lihat Data E-wallet Gopay Berdasarkan ID', description: 'API dapat digunakan untuk menampilkan data Gopay sebagai bentuk pembayaran atau pengecekan oleh admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Gopay ID yang akan ditampilkan' })
  getGopayByID(@Param('id', UUIDValidationPipe) id: string): Promise<Gopay>{
    return this.gopayService.getGopayById(id);
  }

  @Post('tambah')
  @ApiOperation({ summary: 'Menambah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data Salah atau Tidak Terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Nama Akun dan Nomor E-wallet yang terdaftar',
    type:CreateGopayDto
  })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async createGopay(@Body() payload: CreateGopayDto, @Request() req){
    return this.gopayService.createGopay(payload, req.user);
  }
  
  @Put('update/:id')
  @ApiOperation({ summary: 'Mengubah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Gopay ID yang akan diubah datanya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async updateGopay(@Param('id', UUIDValidationPipe) id: string,@Body() payload: UpdateGopayDto,){
    return this.gopayService.updateGopay(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Menghapus Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Gopay ID yang akan dihapus' }) 
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
      return this.gopayService.deleteGopay(id);
  }
}
