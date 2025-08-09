import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IUser } from 'src/users/users.interface';
import { IPayload } from '../auth.service';
import { RolesService } from 'src/roles/roles.service';
import { permission } from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly roleService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IPayload) {
    const { _id, name, email, role } = payload;

    //req.user

    const userRole = role as unknown as { _id: string; name: string };
    const temp = await this.roleService.findOne(userRole._id);
    const permissions = temp?.toObject().permissions ?? [];

    return {
      _id,
      name,
      email,
      role,
      permissions,
    };
  }
}
