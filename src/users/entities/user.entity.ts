import { BaseEntity } from '@/common';
import { Role } from '@/types';
import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'users',
})
export class User extends BaseEntity {
  @Column({
    name: 'first_name',
  })
  @IsString({
    message: 'String required',
  })
  @Length(0, 255, {
    message: 'Required 1 - 255 length',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  @IsString({
    message: 'String required',
  })
  @Length(0, 255, {
    message: 'Required 1 - 255 length',
  })
  lastName: string;

  @Column({
    name: 'email',
    unique: true,
  })
  @IsEmail()
  email: string;

  @Column({
    name: 'photo',
    default: '',
  })
  photo?: string;

  @Column({
    name: 'password',
  })
  password: string;

  @Column({
    name: 'confirmation_hash',
    default: null,
  })
  confirmationHash?: string;

  @Column({
    name: 'is_active',
    default: false,
  })
  isActive: boolean;

  @Column({
    name: 'is_email_verified',
    default: null,
  })
  isEmailVerified?: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    name: 'roles',
    array: true,
    default: [Role.User],
  })
  roles: Role[] = [];
}
