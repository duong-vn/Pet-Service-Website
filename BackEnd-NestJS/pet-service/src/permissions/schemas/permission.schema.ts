import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PermissionDocument = HydratedDocument<Permission>;
@Schema()
export class Permission {
  @Prop()
  name: string;

  @Prop()
  apiPath: string;

  @Prop()
  method: string; // GET | POST | PUT | DELETE | PATCH

  @Prop()
  module: string; // e.g., 'users', 'resumes', etc.

  @Prop({ type: Object })
  createdBy: {
    _id: string;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: string;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
