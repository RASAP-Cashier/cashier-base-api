import { IsDate, IsInt, IsString, Length, Min } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  constructor(properties?: any) {
    if (properties) {
      Object.assign(this, properties);

      this._createdAt = new Date(properties._createdAt || new Date());
      this._updatedAt = new Date(properties._updatedAt || new Date());
    }
  }

  @PrimaryGeneratedColumn()
  @IsInt()
  @Min(0)
  id: number;

  @CreateDateColumn({
    name: '_created_at',
  })
  @IsDate()
  _createdAt: Date;

  @Column({
    name: '_created_by',
    default: null,
  })
  @IsString()
  @Length(0, 255)
  _createdBy: string;

  @UpdateDateColumn({
    name: '_updated_at',
  })
  @IsDate()
  _updatedAt: Date;

  @Column({
    name: '_updated_by',
    default: null,
  })
  @IsString()
  @Length(0, 255)
  _updatedBy: string;
}
