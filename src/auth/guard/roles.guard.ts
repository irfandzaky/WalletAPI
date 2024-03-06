import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import Role from 'src/users/entity/roles.enum';
import RequestWithUser from '../interface/requestWithUser.interface';
 
const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
 
      return user?.role.includes(role);
    }
  }
 
  return mixin(RoleGuardMixin);
}
export default RoleGuard;