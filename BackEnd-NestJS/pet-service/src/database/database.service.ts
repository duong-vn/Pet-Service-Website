import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';
import { INIT_PERMISSIONS } from './sample';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}

  async onModuleInit() {
    const countPermssion = await this.permissionModel.countDocuments({});
    if (countPermssion === 0) {
      this.permissionModel.insertMany(INIT_PERMISSIONS);
    }
  }
}
