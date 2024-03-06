import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectOvo = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.ovo;
});