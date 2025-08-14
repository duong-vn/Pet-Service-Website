import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudService {
  constructor(private configService: ConfigService) {}
  // delete() {
  //   const params = {
  //     folder: 'zozo/services',
  //     timestamp: 1755161843, // ví dụ; dùng số epoch giây
  //     upload_preset: 'zozo',
  //   };

  //   const apiSecret = 'ukLKjxB0DQVetUAylEAA4Jtxj8A';
  //   const sig = cloudinary.utils.api_sign_request(params, apiSecret);

  //   console.log('SDK signature:', sig);
  //   return sig === '8541acb3b06df5d5f121813d45b9504204c2a984';
  // }
  delete(public_id: string) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });

    return cloudinary.uploader.destroy(public_id);
  }

  sign(folder: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const upload_preset = this.configService.getOrThrow(
      'CLOUDINARY_UPLOAD_PRESET',
    );

    const toSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${upload_preset}`;

    const signature = crypto
      .createHash('sha1')
      .update(toSign + this.configService.getOrThrow('CLOUDINARY_API_SECRET')!)
      .digest('hex');

    return {
      timestamp,
      folder,
      signature,
      cloudName: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      apiKey: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      uploadPreset: this.configService.getOrThrow('CLOUDINARY_UPLOAD_PRESET'),
    };
  }
}
