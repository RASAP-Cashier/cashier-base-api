import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GlobalPspConfiguration } from "./GlobalPspConfiguration";
import { Merchant } from "./Merchant";
import { MerchantWidgetConfiguration } from "./MerchantWidgetConfiguration";
import { RoutingConfiguration } from "./RoutingConfiguration";

@Index("merchant_psp_configuration_pkey", ["configurationId"], { unique: true })
@Entity("merchant_psp_configuration", { schema: "public" })
export class MerchantPspConfiguration {
  @PrimaryGeneratedColumn({ type: "integer", name: "configuration_id" })
  configurationId: number;

  @Column("character varying", {
    name: "supported_currencies",
    nullable: true,
    length: 255,
  })
  supportedCurrencies: string | null;

  @Column("numeric", {
    name: "minimum_value",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  minimumValue: string | null;

  @Column("numeric", {
    name: "max_volume",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  maxVolume: string | null;

  @Column("character varying", {
    name: "settlement_currency",
    nullable: true,
    length: 3,
  })
  settlementCurrency: string | null;

  @Column("character varying", { name: "region", nullable: true, length: 255 })
  region: string | null;

  @Column("boolean", { name: "is_active", nullable: true })
  isActive: boolean | null;

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
    () => GlobalPspConfiguration,
    (globalPspConfiguration) => globalPspConfiguration.merchantPspConfigurations
  )
  @JoinColumn([{ name: "enabled_psp_id", referencedColumnName: "pspId" }])
  enabledPsp: GlobalPspConfiguration;

  @ManyToOne(() => Merchant, (merchant) => merchant.merchantPspConfigurations)
  @JoinColumn([{ name: "merchant_id", referencedColumnName: "userId" }])
  merchant: Merchant;

  @OneToMany(
    () => MerchantWidgetConfiguration,
    (merchantWidgetConfiguration) =>
      merchantWidgetConfiguration.pspConfiguration
  )
  merchantWidgetConfigurations: MerchantWidgetConfiguration[];

  @OneToMany(
    () => RoutingConfiguration,
    (routingConfiguration) => routingConfiguration.configuration
  )
  routingConfigurations: RoutingConfiguration[];
}
