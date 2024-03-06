import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Put, UseInterceptors, UploadedFile, UseFilters} from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto } from './dto/create-transaksi.dto';
import { UpdateTransaksiDto } from './dto/update-transaksi.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectTransaksi } from 'src/etc/decorator/inject-transaksi.decorator';
import { Transaksi } from './entities/transaksi.entity';
import { UUIDValidationPipe } from '../etc/pipes/uuid-validation.pipe';
import { JwtGuard } from '../auth/guard/jwt.guard';
import RoleGuard from 'src/auth/guard/roles.guard';
import { Admin } from '../users/entity/admin.entity';
import Role from 'src/users/entity/roles.enum';
import { Dana } from '../wallet/dana/entities/dana.entity';
import { InjectDana } from 'src/etc/decorator/inject-dana.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { uploadBuktiDto } from './dto/upload-bukti.dto';
import { RefundDto } from '../refund/dto/refund.dto';
import { InjectRefund } from 'src/etc/decorator/inject-refund.decorator';
import { Refund } from '../refund/entities/refund.entity';
// import { IPGuard } from 'src/etc/ipFilter/ipFilter.middleware';

@ApiTags('Transaksi')
@ApiBearerAuth()
@Controller('transaksi')
export class TransaksiController {
  constructor(
    private readonly transaksiService: TransaksiService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat Data Keseluruhan Transaksi', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllTransaksi(@InjectTransaksi() transaksi: Transaksi){
    return this.transaksiService.getAllTransaksi()
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Lihat Data Transaksi Berdasarkan id', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Transaksi ID yang akan ditampilkan' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getTransaksiByID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi>{
    return this.transaksiService.getTransaksiByIDforAdm(id);
  }

  @Get('/riwayat/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getTransaksiByUserId(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getTransaksiByUserID(id);
  }

  @Get('Dana/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Dana', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllTransaksiDana(): Promise<Transaksi[]>{
    return this.transaksiService.getAllTransaksiDana();
  }

  @Get('/riwayatDana/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi Dana', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getDanaByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getDanaByUserId(id);
  }

  @Get('Ovo/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Ovo', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllTransaksiOvo(): Promise<Transaksi[]>{
    return this.transaksiService.getAllTransaksiOvo();
  }

  @Get('/riwayatOvo/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi Ovo', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getOvoByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getOvoByUserId(id);
  }

  @Get('LinkAja/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi LinkAja', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllTransaksiLinkAja(): Promise<Transaksi[]>{
    return this.transaksiService.getAllTransaksiLinkAja();
  }

  @Get('/riwayatLinkAja/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi LinkAja', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getLinkAjaByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getLinkAjaByUserId(id);
  }

  @Get('Gopay/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Gopay', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllTransaksiGopay(): Promise<Transaksi[]>{
    return this.transaksiService.getAllTransaksiGopay();
  }

  @Get('/riwayatGopay/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi Gopay', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getGopayByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getGopayByUserId(id);
  }

  @Get('Shopeepay/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Shopeepay', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllTransaksiShopeepay(): Promise<Transaksi[]>{
    return this.transaksiService.getAllTransaksiShopeepay();
  }

  @Get('/riwayatShopeepay/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi Shopeepay', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getShopeepayByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getShopeepayByUserId(id);
  }

  @Get('statusMenunggu/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Menunggu', description: 'Melihat semua data transaksi dengan status transaksi menunggu <br> Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllStatusMenunggu(): Promise<Transaksi[]>{
    return this.transaksiService.getStatusMenunggu()
  }

  @Get('statusGagal/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Gagal', description: 'Melihat semua data transaksi dengan status transaksi gagal <br> Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllStatusGagal(): Promise<Transaksi[]>{
    return this.transaksiService.getStatusGagal()
  }

  @Get('statusBerhasil/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Berhasil', description: 'Melihat semua data transaksi dengan status transaksi berhasil <br> Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllStatusBerhasil(): Promise<Transaksi[]>{
    return this.transaksiService.getStatusBerhasil()
  }

  @Get('statusDibatalkan/all')
  @ApiOperation({ summary: 'Melihat Semua Transaksi Dibatalkan', description: 'Melihat semua data transaksi dengan status transaksi batal <br> Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  getAllStatusDibatalkan(): Promise<Transaksi[]>{
    return this.transaksiService.getStatusDibatalkan()
  }

  @Get('/riwayatBerhasil/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi yang Berhasil', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getBerhasilByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getStatusBerhasilByUserId(id);
  }

  @Get('/riwayatGagal/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi yang Gagal', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getGagalByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getStatusGagalByUserId(id);
  }

  @Get('/riwayatDibatalkan/:id')
  @ApiOperation({ summary: 'Lihat Data Riwayat Transaksi yang Batal', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan User ID' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  getDibatalkanByUserID(@Param('id', UUIDValidationPipe) id: string): Promise<Transaksi[]>{
    return this.transaksiService.getStatusDibatalkanByUserId(id);
  }

  @Post('bayarDana')
  @ApiOperation({ summary: 'Transaksi dengan Pembayaran Dana', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Data Transaksi <br> Tujuan: Tujuan E-wallet <br> Nomor: Nomor Tujuan <br> Nama Akun: Nama Akun yang terdaftar di E-wallet <br> Jumlah: Jumlah yang akan di transfer <br> Catatan: Catatan jika ada',
    type:CreateTransaksiDto
  })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  async createTransaksiDana(@Body() payload: CreateTransaksiDto, @Request() req){
    let metode_bayar = 'Dana';
    return this.transaksiService.createTransaksiDana(payload, metode_bayar, req.user);
  }

  @Post('bayarGopay')
  @ApiOperation({ summary: 'Transaksi dengan Pembayaran Gopay', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Data Transaksi <br> Tujuan: Tujuan E-wallet <br> Nomor: Nomor Tujuan <br> Nama Akun: Nama Akun yang terdaftar di E-wallet <br> Jumlah: Jumlah yang akan di transfer <br> Catatan: Catatan jika ada',
    type:CreateTransaksiDto
  })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  async createTransaksiGopay(@Body() payload: CreateTransaksiDto, @Request() req){
    let metode_bayar = 'Gopay';
    return this.transaksiService.createTransaksiGopay(payload, metode_bayar, req.user);
  }

  @Post('bayarOvo')
  @ApiOperation({ summary: 'Transaksi dengan Pembayaran Ovo', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Data Transaksi <br> Tujuan: Tujuan E-wallet <br> Nomor: Nomor Tujuan <br> Nama Akun: Nama Akun yang terdaftar di E-wallet <br> Jumlah: Jumlah yang akan di transfer <br> Catatan: Catatan jika ada',
    type:CreateTransaksiDto
  })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  async createTransaksiOvo(@Body() payload: CreateTransaksiDto, @Request() req){
    let metode_bayar = 'Ovo';
    return this.transaksiService.createTransaksiOvo(payload, metode_bayar, req.user);
  }

  @Post('bayarLinkAja')
  @ApiOperation({ summary: 'Transaksi dengan Pembayaran LinkAja', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Data Transaksi <br> Tujuan: Tujuan E-wallet <br> Nomor: Nomor Tujuan <br> Nama Akun: Nama Akun yang terdaftar di E-wallet <br> Jumlah: Jumlah yang akan di transfer <br> Catatan: Catatan jika ada',
    type:CreateTransaksiDto
  })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  async createTransaksiLinkAJa(@Body() payload: CreateTransaksiDto, @Request() req){
    let metode_bayar = 'LinkAja';
    return this.transaksiService.createTransaksiLinkAja(payload, metode_bayar, req.user);
  }

  @Post('bayarShopeepay')
  @ApiOperation({ summary: 'Transaksi dengan Pembayaran Shopeepay', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiBody({
    description: 'Masukkan Data Transaksi <br> Tujuan: Tujuan E-wallet <br> Nomor: Nomor Tujuan <br> Nama Akun: Nama Akun yang terdaftar di E-wallet <br> Jumlah: Jumlah yang akan di transfer <br> Catatan: Catatan jika ada',
    type:CreateTransaksiDto
  })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  async createTransaksiShopeepay(@Body() payload: CreateTransaksiDto, @Request() req){
    let metode_bayar = 'Shopeepay';
    return this.transaksiService.createTransaksiShopeepay(payload, metode_bayar, req.user);
  }

  @Put('uploadBukti/:id')
  @ApiOperation({ summary: 'Upload Bukti Transaksi', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Gambar yg diupload tidak valid'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Masukkan ID Transaksi' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('bukti',{
    storage : diskStorage({
        destination : './asset/pembayaran',
        filename : (req:any,file,cb) =>{
            const namafile = [req.user.id,Date.now()].join('-')
            cb(null,namafile+extname(file.originalname))
        }
    })
  }))
  @ApiConsumes('multip  art/form-data')
  @ApiBody({
    description: 'Masukkan gambar yang akan diupload',
    type: uploadBuktiDto
  })
  async uploadBukti(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: uploadBuktiDto,
    @UploadedFile() bukti: Express.Multer.File){
      if(bukti){
        payload.bukti = bukti.filename;
      }
      return this.transaksiService.uploadBukti(id,payload);
  }

  @Put('refund/:id')
  @ApiOperation({ summary: 'Meminta Pengembalian Dana', description: 'Penggunaan: <br> Login: Pengguna <br> Hak Akses: Pengguna' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 400, description: 'Bad Request: Data salah atau tidak terisi'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Transaksi ID yang akan di minta pengembalian dana' })
  @UseGuards(RoleGuard(Role.Pengguna))
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('bukti_refund',{
    storage : diskStorage({
        destination : './asset/refund',
        filename : (req:any,file,cb) =>{
            const namafile = [req.user.id,Date.now()].join('-')
            cb(null,namafile+extname(file.originalname))
        }
    })
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Masukkan Data Pengembalian Dana',
    type: RefundDto
  })
  async createRefund(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() payload: RefundDto,
    @UploadedFile() bukti_refund: Express.Multer.File){
      if(bukti_refund){
        payload.bukti_refund = bukti_refund.filename;
      }
      return this.transaksiService.createRefund(id, payload);
  }

  @Put('statusBerhasil/:id')
  @ApiOperation({ summary: 'Mengubah Status Transaksi Menjadi Berhasil', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Transaksi ID yang akan diubah statusnya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  statusBerhasil(@Param('id', UUIDValidationPipe) id: string){
        return this.transaksiService.statusBerhasil(id)
  }

  @Put('statusGagal/:id')
  @ApiOperation({ summary: 'Mengubah Status Transaksi Menjadi Gagal', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Transaksi ID yang akan diubah statusnya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  statusGagal(@Param('id', UUIDValidationPipe) id: string){
        return this.transaksiService.statusGagal(id)
  }

  @Put('statusBatal/:id')
  @ApiOperation({ summary: 'Mengubah Status Transaksi Menjadi Batal', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Transaksi ID yang akan diubah statusnya' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  statusBatal(@Param('id', UUIDValidationPipe) id: string){
        return this.transaksiService.statusBatal(id)
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Hapus Data Transaksi', description: 'Penggunaan: <br> Login: Admin <br> Hak Akses: Admin' })
  @ApiResponse({ status: 200, description: 'Respon Berhasil'})
  @ApiResponse({ status: 401, description: 'Unauthorized: Belum Login'})
  @ApiResponse({ status: 403, description: 'Forbidden Resource: Hak Akses Salah'})
  @ApiResponse({ status: 404, description: 'Input ID tidak ditemukan atau salah'})
  @ApiParam({ name: 'id', description: 'Transaksi ID yang akan dimasukkan' })
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtGuard)
  async deleteTransaksi(@Param('id', UUIDValidationPipe)id: string): Promise<void>{
    return this.transaksiService.deleteTransaksi(id);
  }

}
