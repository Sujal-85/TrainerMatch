import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;

  @IsEnum(['SUPER_ADMIN', 'VENDOR_ADMIN', 'VENDOR_USER', 'TRAINER'])
  role: string;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  firebaseUid?: string;
}