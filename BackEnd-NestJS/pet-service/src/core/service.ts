import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';
import { Permissions } from 'src/decorator/customize';

export const checkMongoId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid id');
  }
};
export const CanGet = (r: string) => Permissions(`${r}:get`);
export const CanPost = (r: string) => Permissions(`${r}:post`);
export const CanPatch = (r: string) => Permissions(`${r}:patch`);
export const CanDelete = (r: string) => Permissions(`${r}:delete`);
