import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectLinkAja = createParamDecorator((data: any, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    return req.linkAja;
});