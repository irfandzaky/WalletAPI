import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectDana } from 'src/etc/decorator/inject-dana.decorator';
import { DanaService } from './dana.service';
import { CreateDanaDto } from './dto/create-dana.dto';
import { UpdateDanaDto } from './dto/update-dana.dto';
import { Dana } from './entities/dana.entity';
import { UUIDValidationPipe } from '../../etc/pipes/uuid-validation.pipe';
import RoleGuard from 'src/auth/guard/roles.guard';
import Role from 'src/users/entity/roles.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@ApiTags('Dana')
@ApiBearerAuth()
@Controller('dana')
export class DanaController {
  constructor(private readonly danaService: DanaService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat Data Keseluruhan E-wallet Dana', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllDana(@InjectDana() dana: Dana){
    return this.danaService.getDana();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lihat Data E-wallet Dana Berdasarkan ID', description: 'API dapat digunakan untuk menampilkan data Dana sebagai bentuk pembayaran atau pengecekan oleh admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Dana ID yang akan ditampilkan' })
  getDanaByID(@Param('id', UUIDValidationPipe) id: string): Promise<Dana>{
    return this.danaService.getDanaById(id);
  }

  @Post('tambah')
  @ApiOperation({ summary: 'Menambah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data Salah atau Tidak Terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Nama Akun dan Nomor E-wallet yang terdaftar',
    type:CreateDanaDto
  })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async createDana(@Body() payload: CreateDanaDto, @Request() req){
    return this.danaService.createDana(payload, req.user);
  }
  
  @Put('update/:id')
  @ApiOperation({ summary: 'Mengubah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Dana ID yang akan diubah datanya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async updateDana(@Param('id', UUIDValidationPipe) id: string,@Body() payload: UpdateDanaDto,){
    return this.danaService.updateDana(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Menghapus Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Dana ID yang akan dihapus' })  
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
      return this.danaService.deleteDana(id);
  }

}
