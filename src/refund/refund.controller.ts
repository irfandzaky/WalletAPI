import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from '../etc/pipes/uuid-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from 'src/auth/guard/roles.guard';
import Role from 'src/users/entity/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RefundDto } from '../refund/dto/refund.dto';
import { Refund } from '../refund/entities/refund.entity';
import { RefundService } from './refund.service';

@ApiTags('Refund')
@ApiBearerAuth()
@Controller('refund')
export class RefundController {
  constructor(
    private readonly refundService: RefundService) {}

  @Get('')
  @ApiOperation({ summary: 'Lihat Data Keseluruhan Pengembalian Dana', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllRefund(): Promise<Refund[]>{
    return this.refundService.getAllRefund();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat Data Pengembalian Dana Berdasarkan ID', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Refund ID yang akan ditampilkan' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getRefundByID(@Param('id', UUIDValidationPipe) id: string): Promise<Refund>{
    return this.refundService.getRefundByID(id);
  }

  @Get('riwayat/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Pengembalian Dana', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID yang akan ditampilkan riwayat' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getRefundByUserId(@Param('id', UUIDValidationPipe) id: string): Promise<Refund[]>{
    return this.refundService.getRefundByUserID(id);
  }

 
  @Get('refundDiajukan/all')
  @ApiOperation({ summary: 'Lihat Data Keseluruhan Pengembalian Dana yang Diajukan', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getRefundDiajukan(): Promise<Refund[]>{
    return this.refundService.getRefundDiajukan()
  }

  @Get('refundDisetujui/all')
  @ApiOperation({ summary: 'Lihat Data Keseluruhan Pengembalian Dana yang Disetujui', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getRefundDisetujui(): Promise<Refund[]>{
    return this.refundService.getRefundDisetujui()
  }

  @Get('refundDitolak/all')
  @ApiOperation({ summary: 'Lihat Data Keseluruhan Pengembalian Dana yang Ditolak', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getRefundDitolak(): Promise<Refund[]>{
    return this.refundService.getRefundDitolak()
  }

  @Get('refundDanaTerkirim/all')
  @ApiOperation({ summary: 'Lihat Data Keseluruhan Pengembalian Dana yang Telah Terkirim', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getRefundDanaTerkirim(): Promise<Refund[]>{
    return this.refundService.getRefundDanaTerkirim()
  }

  // @Put(':id')
  // // @UseGuards(RoleGuard(Role.Pengguna))
  // @UseGuards(JwtGuard)
  // @UseInterceptors(FileInterceptor('bukti_refund',{
  //   storage : diskStorage({
  //       destination : './asset/refund',
  //       filename : (req:any,file,cb) =>{
  //           const namafile = [req.user.id,Date.now()].join('-')
  //           cb(null,namafile+extname(file.originalname))
  //       }
  //   })
  // }))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({type: RefundDto})
  // async createRefund(
  //   @Param('id', UUIDValidationPipe) id: string,
  //   @Body() payload: RefundDto,
  //   @UploadedFile() bukti_refund: Express.Multer.File,
  //   @Request() req){
  //     if(bukti_refund){
  //       payload.bukti_refund = bukti_refund.filename;
  //     }
  //     return this.refundService.createRefund(id, payload, req.user);
  // }

  @Put('refundSetuju/:id')
  @ApiOperation({ summary: 'Mengubah Status Refund Menjadi Disetujui', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Refund ID yang akan diubah status' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  statusRefundSetuju(@Param('id', UUIDValidationPipe) id: string){
        return this.refundService.statusRefundSetuju(id)
  }

  @Put('refundTolak/:id')
  @ApiOperation({ summary: 'Mengubah Status Refund Menjadi Ditolak', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Refund ID yang akan diubah status' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  statusRefundTolak(@Param('id', UUIDValidationPipe) id: string){
        return this.refundService.statusRefundTolak(id)
  }

  @Put('refundBerhasil/:id')
  @ApiOperation({ summary: 'Mengubah Status Refund Menjadi Berhasil', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Refund ID yang akan diubah status' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  statusRefundBerhasil(@Param('id', UUIDValidationPipe) id: string){
        return this.refundService.statusRefundBerhasil(id)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Menghapus Data Refund', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Refund ID yang akan dihapus' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteRefund(@Param('id', UUIDValidationPipe)id: string): Promise<void>{
    return this.refundService.deleteRefund(id);
  }

}
