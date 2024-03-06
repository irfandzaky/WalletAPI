import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const  InjectDana = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.dana;
});