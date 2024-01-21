import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Merchant } from "./Merchant";

@Index("subscription_type_pkey", ["subscriptionTypeId"], { unique: true })
@Entity("subscription_type", { schema: "public" })
export class SubscriptionType {
  @PrimaryGeneratedColumn({ type: "integer", name: "subscription_type_id" })
  subscriptionTypeId: number;

  @Column("character varying", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("numeric", { name: "price", nullable: true, precision: 10, scale: 2 })
  price: string | null;

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

  @OneToMany(() => Merchant, (merchant) => merchant.subscriptionType)
  merchants: Merchant[];
}
