// google-auth.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.client = new OAuth2Client(googleClientId);
  }

  async verifyToken(token: string) {
    // try {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.name) {
      throw new BadRequestException(
        'Invalid Google token: missing email or name',
      );
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    // } catch (error) {
    //   throw new BadGatewayException('Lỗi verify người dùng');
    // }
  }
}
