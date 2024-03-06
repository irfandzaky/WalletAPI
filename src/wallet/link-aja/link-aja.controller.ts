import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { LinkAjaService } from './link-aja.service';
import { UpdateLinkAjaDto } from './dto/update-link-aja.dto';
import { CreateLinkAjaDto } from './dto/create-linkAja.dto';
import { InjectLinkAja } from 'src/etc/decorator/inject-linkAja.decorator';
import { LinkAja } from './entities/linkaja.entity';
import { UUIDValidationPipe } from '../../etc/pipes/uuid-validation.pipe';
import RoleGuard from 'src/auth/guard/roles.guard';
import Role from 'src/users/entity/roles.enum';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('LinkAja')
@ApiBearerAuth()
@Controller('link-aja')
export class LinkAjaController {
  constructor(private readonly linkAjaService: LinkAjaService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat Data Keseluruhan E-wallet LinkAja', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllLinkAja(@InjectLinkAja() linkAja: LinkAja){
    return this.linkAjaService.getLinkAja();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lihat Data E-wallet LinkAja Berdasarkan ID', description: 'API dapat digunakan untuk menampilkan data LinkAja sebagai bentuk pembayaran atau pengecekan oleh admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'LinkAja ID yang akan ditampilkan' })
  getLinkAjaByID(@Param('id', UUIDValidationPipe) id: string): Promise<LinkAja>{
    return this.linkAjaService.getLinkAjaById(id);
  }

  @Post('tambah')
  @ApiOperation({ summary: 'Menambah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Nama Akun dan Nomor E-wallet yang terdaftar',
    type:CreateLinkAjaDto
  })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async createLinkAja(@Body() payload: CreateLinkAjaDto, @Request() req){
    return this.linkAjaService.createLinkAja(payload, req.user);
  }
  
  @Put('update/:id')
  @ApiOperation({ summary: 'Mengubah Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'LinkAja ID yang akan diubah datanya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async updateLinkAja(@Param('id', UUIDValidationPipe) id: string,@Body() payload: UpdateLinkAjaDto,){
    return this.linkAjaService.updateLinkAja(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Menghapus Data E-wallet', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'LinkAja ID yang akan dihapus' }) 
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id', UUIDValidationPipe) id: string): Promise<void>{
      return this.linkAjaService.deleteLinkAja(id);
  }
}
