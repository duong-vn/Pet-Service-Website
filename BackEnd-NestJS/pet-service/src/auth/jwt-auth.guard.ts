import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const req: Request = context.switchToHttp().getRequest();
    const method = req.method;
    const path = req.route.path as string;
    const { permissions } = user;
    // console.log('>>method', method, 'path', path, 'permissions', permissions);

    let isExist = permissions.find(
      (permission) =>
        method === permission.method && path === permission.apiPath,
    );
    if (path.startsWith('/api/auth')) isExist = true;

    if (!isExist) {
      throw new ForbiddenException(
        'Forbidden: You do not have permission to access this resource',
      );
    }

    return user;
  }
}
