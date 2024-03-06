import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectShopeepay = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.shopeepay;
});