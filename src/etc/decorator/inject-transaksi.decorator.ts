import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectTransaksi = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.transaksi;
});