import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from 'src/decorator/customize';

import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private refl: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.refl.getAllAndOverride(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    const required =
      this.refl.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
      ]) ?? [];
    if (!required.length) return true; // chưa gắn quyền -> only JWT
    const req = ctx.switchToHttp().getRequest();
    const role_id = req.user.role._id!;
    const permissionKeys =
      await this.rolesService.getPermissionsForRole(role_id); // Set<string> (có cache)
    const set = new Set(permissionKeys);
    return required.every((p) => set.has(p));
  }
}
