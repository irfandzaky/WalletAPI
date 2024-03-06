// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';

// @Injectable()
// export class IPGuard implements CanActivate {
//  canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<Request>();
//     const clientIP = request.ip;

//     // Replace 'your_allowed_ip' with the actual IP address you want to allow
//     return clientIP === '::1';
//  }
// }