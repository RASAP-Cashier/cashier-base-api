import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Merchant } from "./Merchant";
import { MerchantPspConfiguration } from "./MerchantPspConfiguration";

@Index("merchant_widget_configuration_pkey", ["widgetId"], { unique: true })
@Entity("merchant_widget_configuration", { schema: "public" })
export class MerchantWidgetConfiguration {
  @PrimaryGeneratedColumn({ type: "integer", name: "widget_id" })
  widgetId: number;

  @Column("json", { name: "configuration", nullable: true })
  configuration: object | null;

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
    () => Merchant,
    (merchant) => merchant.merchantWidgetConfigurations
  )
  @JoinColumn([{ name: "merchant_id", referencedColumnName: "userId" }])
  merchant: Merchant;

  @ManyToOne(
    () => MerchantPspConfiguration,
    (merchantPspConfiguration) =>
      merchantPspConfiguration.merchantWidgetConfigurations
  )
  @JoinColumn([
    { name: "psp_configuration_id", referencedColumnName: "configurationId" },
  ])
  pspConfiguration: MerchantPspConfiguration;
}
