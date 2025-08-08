import { BadRequestException } from '@nestjs/common';
import mongoose from 'mongoose';

export const checkMongoId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid id');
  }
};
