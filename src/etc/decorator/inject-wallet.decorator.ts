import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectWallet = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.wallet;
});