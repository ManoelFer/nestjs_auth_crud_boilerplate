import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/shared/constants/role.enum';

const RolesGuard = (roleAllowed: Role): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      const { roles } = user;
      let isAllowed = false;

      roles.forEach(({ role }) => {
        if (role.name.toLowerCase() === roleAllowed.toLowerCase()) {
          isAllowed = true;
        }
      });

      return isAllowed;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RolesGuard;
