import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectRefund = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.refund;
});