import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // If no roles are required, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      return false;
    }

    console.log('RolesGuard is run successfully !!');

    return requiredRoles.some((role) => user.role === role);
  }
}
