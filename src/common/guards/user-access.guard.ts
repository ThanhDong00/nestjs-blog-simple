import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '../constants/enum';

@Injectable()
export class UserAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    // console.log('UserAccessGuard: User:', user);
    // console.log('UserAccessGuard: Request params:', req.params.id);

    if (user && user.role === Role.Admin) {
      console.log('UserAccessGuard: User is an admin, access granted');
      return true;
    }

    if (user && user.role === Role.User) {
      if (user.sub === parseInt(req.params.id, 10)) {
        console.log(
          'UserAccessGuard: User is accessing their own resource, access granted',
        );
        return true;
      }
    }

    console.log('UserAccessGuard: Access denied: User is not authorized');
    return false;
  }
}
