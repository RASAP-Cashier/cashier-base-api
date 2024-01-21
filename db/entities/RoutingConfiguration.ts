import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MerchantPspConfiguration } from "./MerchantPspConfiguration";
import { Merchant } from "./Merchant";
import { GlobalPspConfiguration } from "./GlobalPspConfiguration";

@Index("routing_configuration_pkey", ["routingId"], { unique: true })
@Entity("routing_configuration", { schema: "public" })
export class RoutingConfiguration {
  @PrimaryGeneratedColumn({ type: "integer", name: "routing_id" })
  routingId: number;

  @Column("character varying", {
    name: "route_id",
    nullable: true,
    length: 255,
  })
  routeId: string | null;

  @Column("character varying", {
    name: "payment_country",
    nullable: true,
    length: 255,
  })
  paymentCountry: string | null;

  @Column("character varying", {
    name: "bin_country",
    nullable: true,
    length: 255,
  })
  binCountry: string | null;

  @Column("character varying", {
    name: "card_type",
    nullable: true,
    length: 50,
  })
  cardType: string | null;

  @Column("character varying", { name: "currency", nullable: true, length: 3 })
  currency: string | null;

  @Column("numeric", {
    name: "minimum_amount",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  minimumAmount: string | null;

  @Column("numeric", {
    name: "max_amount",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  maxAmount: string | null;

  @Column("character varying", { name: "device", nullable: true, length: 255 })
  device: string | null;

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

  @ManyToOne(
    () => MerchantPspConfiguration,
    (merchantPspConfiguration) => merchantPspConfiguration.routingConfigurations
  )
  @JoinColumn([
    { name: "configuration_id", referencedColumnName: "configurationId" },
  ])
  configuration: MerchantPspConfiguration;

  @ManyToOne(() => Merchant, (merchant) => merchant.routingConfigurations)
  @JoinColumn([{ name: "merchant_id", referencedColumnName: "userId" }])
  merchant: Merchant;

  @ManyToOne(
    () => GlobalPspConfiguration,
    (globalPspConfiguration) => globalPspConfiguration.routingConfigurations
  )
  @JoinColumn([{ name: "psp_id", referencedColumnName: "pspId" }])
  psp: GlobalPspConfiguration;
}
