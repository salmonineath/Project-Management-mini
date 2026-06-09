import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const ROLE_KEY = 'role'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<string []>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole || requiredRole.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !requiredRole.includes(user.role)) {
            throw new ForbiddenException('You are not allowed to perform this action. This action is for the admin only!')
        }

        return true;
    }
}