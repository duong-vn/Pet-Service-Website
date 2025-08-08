// src/appointments/dto/create-appointment.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsMongoId,
  IsOptional,
  MaxLength,
  IsDateString,
  Validate,
  Matches,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  OTHER = 'other',
}

export const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateAppointmentDto {
  /**
   * Nếu lấy user từ access token (req.user._id) thì để @IsOptional() ở đây.
   * Nếu bạn truyền user id từ client, đổi lại thành @IsNotEmpty() + @IsMongoId().
   */
  //   @IsNotEmpty({ message: 'Điền thiếu tên khách' })
  //   @IsMongoId({ message: 'user phải là ObjectId hợp lệ.' })
  //   user: mongoose.Schema.Types.ObjectId;
  //  Khong can user vi da co trong jwt

  @IsNotEmpty({ message: 'service là bắt buộc.' })
  @IsMongoId({ message: 'service phải là ObjectId hợp lệ.' })
  service!: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'petType là bắt buộc.' })
  @IsEnum(PetType, { message: 'petType ngoài định dạng' })
  petType!: PetType;

  @IsNotEmpty({ message: 'petWeight là bắt buộc.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'petWeight phải là số.' })
  @Min(0.5, { message: 'petWeight tối thiểu 0.5kg.' })
  @Max(100, { message: 'petWeight tối đa 100kg.' })
  petWeight!: number;

  // Nhân viên phụ trách (optional, có thể gán sau khi confirm)
  @IsOptional()
  @IsMongoId({ message: 'staff phải là ObjectId hợp lệ.' })
  staff?: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'date là bắt buộc.' })
  @IsDateString(
    {},
    { message: 'date phải ở dạng ISO (YYYY-MM-DD hoặc ISO full).' },
  )
  date!: string;

  @IsNotEmpty({ message: 'startTime là bắt buộc.' })
  @Matches(HH_MM_REGEX, {
    message: 'startTime phải theo định dạng HH:mm (00-23:00-59).',
  })
  startTime!: string;

  @IsNotEmpty({ message: 'endTime là bắt buộc.' })
  @Matches(HH_MM_REGEX, {
    message: 'endTime phải theo định dạng HH:mm (00-23:00-59).',
  })
  endTime!: string;

  @IsOptional()
  @IsString({ message: 'note phải là chuỗi.' })
  @MaxLength(200, { message: 'note tối đa 200 ký tự.' })
  note?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'], {
    message: 'status must be either PENDING | COMFIRMED | COMPLETED | CANCELED',
  })
  status?: string;
}
