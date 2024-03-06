import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { OvoService } from './ovo.service';
import { CreateOvoDto } from './dto/create-ovo.dto';
import { UpdateOvoDto } from './dto/update-ovo.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectOvo } from 'src/etc/decorator/inject-ovo.decorator';
import { Ovo } from './entities/ovo.entity';
import { UUIDValidationPipe } from '../../etc/pipes/uuid-validation.pipe';
import RoleGuard from 'src/auth/guard/roles.guard';
import Role from 'src/users/entity/roles.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Ovo')
@ApiBearerAuth()
@Controller('ovo')
export class OvoController {
  constructor(private readonly ovoService: OvoService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat Data Keseluruhan E-wallet Ovo', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllOvo(@InjectOvo() ovo: Ovo){
    return this.ovoService.getOvo();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lihat Data E-wallet Ovo Berdasarkan ID', description: 'API dapat digunakan untuk menampilkan data Ovo sebagai bentuk pembayaran atau pengecekan oleh admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Ovo ID yang akan ditampilkan' })
  getOvoByID(@Param('id', UUIDValidationPipe) id: string): Promise<Ovo>{
    return this.ovoService.getOvoById(id);
  }

  @Post('tambah')
  @ApiOperation({ summary: 'Menambah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Nama Akun dan Nomor E-wallet yang terdaftar',
    type:CreateOvoDto
  })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async createOvo(@Body() payload: CreateOvoDto, @Request() req){
    return this.ovoService.createOvo(payload, req.user);
  }
  
  @Put('update/:id')
  @ApiOperation({ summary: 'Mengubah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Ovo ID yang akan diubah datanya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async updateOvo(@Param('id', UUIDValidationPipe) id: string,@Body() payload: UpdateOvoDto,){
    return this.ovoService.updateOvo(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Menghapus Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Ovo ID yang akan dihapus' }) 
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
      return this.ovoService.deleteOvo(id);
  }
}
