import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { ShopeepayService } from './shopeepay.service';
import { CreateShopeepayDto } from './dto/create-shopeepay.dto';
import { UpdateShopeepayDto } from './dto/update-shopeepay.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectShopeepay } from 'src/etc/decorator/inject-shopeepay.decorator';
import { Shopeepay } from './entities/shopeepay.entity';
import { UUIDValidationPipe } from '../../etc/pipes/uuid-validation.pipe';
import RoleGuard from 'src/auth/guard/roles.guard';
import Role from 'src/users/entity/roles.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Shopeepay')
@ApiBearerAuth()
@Controller('shopeepay')
export class ShopeepayController {
  constructor(private readonly shopeepayService: ShopeepayService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat Data Keseluruhan E-wallet Shopeepay', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllShopeepay(@InjectShopeepay() shopeepay: Shopeepay){
    return this.shopeepayService.getShopeepay();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lihat Data E-wallet Shopeepay Berdasarkan ID', description: 'API dapat digunakan untuk menampilkan data Shopeepay sebagai bentuk pembayaran atau pengecekan oleh admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Shopeepay ID yang akan ditampilkan' })
  getShopeepayByID(@Param('id', UUIDValidationPipe) id: string): Promise<Shopeepay>{
    return this.shopeepayService.getShopeepayById(id);
  }

  @Post('tambah')
  @ApiOperation({ summary: 'Menambah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Nama Akun dan Nomor E-wallet yang terdaftar',
    type:CreateShopeepayDto
  })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async createShopeepay(@Body() payload: CreateShopeepayDto, @Request() req){
    return this.shopeepayService.createShopeepay(payload, req.user);
  }
  
  @Put('update/:id')
  @ApiOperation({ summary: 'Mengubah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Shopeepay ID yang akan diubah datanya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async updateShopeepay(@Param('id', UUIDValidationPipe) id: string,@Body() payload: UpdateShopeepayDto,){
    return this.shopeepayService.updateShopeepay(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Menghapus Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Shopeepay ID yang akan dihapus' })    
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
      return this.shopeepayService.deleteShopeepay(id);
  }

}
