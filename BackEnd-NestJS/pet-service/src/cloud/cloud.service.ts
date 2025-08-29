import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
import { openSync } from 'fs';
@Injectable()
export class CloudService {
  constructor(private configService: ConfigService) {}

  delete(public_id: string) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });

    return cloudinary.uploader.destroy(public_id);
  }

  sign(folder: string, publicId?: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const upload_preset = this.configService.getOrThrow(
      'CLOUDINARY_UPLOAD_PRESET',
    );

    const toSign: Record<string, any> = {
      timestamp,
      folder,
      upload_preset,
    };
    if (publicId) toSign.public_id = publicId;
    const tosign = Object.keys(toSign)
      .sort()
      .map((k) => `${k}=${toSign[k]}`)
      .join('&');
    const signature = crypto
      .createHash('sha1')
      .update(tosign + this.configService.getOrThrow('CLOUDINARY_API_SECRET')!)
      .digest('hex');

    return {
      timestamp,
      public_id: publicId,
      folder,
      signature,
      cloudName: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      apiKey: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      uploadPreset: this.configService.getOrThrow('CLOUDINARY_UPLOAD_PRESET'),
    };
  }
}
