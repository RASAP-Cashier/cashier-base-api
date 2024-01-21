import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Merchant } from "./Merchant";

@Index("kyb_pkey", ["kybId"], { unique: true })
@Entity("kyb", { schema: "public" })
export class Kyb {
  @PrimaryGeneratedColumn({ type: "integer", name: "kyb_id" })
  kybId: number;

  @Column("character varying", {
    name: "business_name",
    nullable: true,
    length: 255,
  })
  businessName: string | null;

  @Column("character varying", {
    name: "registration_number",
    nullable: true,
    length: 255,
  })
  registrationNumber: string | null;

  @Column("character varying", { name: "address", nullable: true, length: 255 })
  address: string | null;

  @Column("character varying", { name: "website", nullable: true, length: 255 })
  website: string | null;

  @Column("character varying", { name: "region", nullable: true, length: 255 })
  region: string | null;

  @Column("character varying", {
    name: "phone_number",
    nullable: true,
    length: 15,
  })
  phoneNumber: string | null;

  @Column("timestamp without time zone", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("character varying", {
    name: "created_by",
    nullable: true,
    length: 255,
  })
  createdBy: string | null;

  @Column("character varying", {
    name: "updated_by",
    nullable: true,
    length: 255,
  })
  updatedBy: string | null;

  @ManyToOne(() => Merchant, (merchant) => merchant.kybs)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Merchant;
}
