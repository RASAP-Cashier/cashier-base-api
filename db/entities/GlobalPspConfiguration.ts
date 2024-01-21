import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Merchant } from "./Merchant";
import { MerchantPspConfiguration } from "./MerchantPspConfiguration";
import { RoutingConfiguration } from "./RoutingConfiguration";
import { TransactionData } from "./TransactionData";

@Index("global_psp_configuration_pkey", ["pspId"], { unique: true })
@Entity("global_psp_configuration", { schema: "public" })
export class GlobalPspConfiguration {
  @PrimaryGeneratedColumn({ type: "integer", name: "psp_id" })
  pspId: number;

  @Column("character varying", {
    name: "psp_name",
    nullable: true,
    length: 255,
  })
  pspName: string | null;

  @Column("boolean", { name: "cards", nullable: true })
  cards: boolean | null;

  @Column("character varying", {
    name: "card_type",
    nullable: true,
    length: 50,
  })
  cardType: string | null;

  @Column("character varying", { name: "region", nullable: true, length: 255 })
  region: string | null;

  @Column("character varying", {
    name: "alternative_payment_method",
    nullable: true,
    length: 255,
  })
  alternativePaymentMethod: string | null;

  @Column("boolean", { name: "crypto", nullable: true })
  crypto: boolean | null;

  @Column("character varying", {
    name: "base_currency",
    nullable: true,
    length: 3,
  })
  baseCurrency: string | null;

  @Column("character varying", { name: "settle", nullable: true, length: 255 })
  settle: string | null;

  @Column("character varying", {
    name: "emt_currency",
    nullable: true,
    length: 3,
  })
  emtCurrency: string | null;

  @Column("numeric", {
    name: "minimum_volume",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  minimumVolume: string | null;

  @Column("numeric", {
    name: "maximum_value",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  maximumValue: string | null;

  @Column("character varying", {
    name: "risk_appetite",
    nullable: true,
    length: 255,
  })
  riskAppetite: string | null;

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

  @ManyToOne(() => Merchant, (merchant) => merchant.globalPspConfigurations)
  @JoinColumn([{ name: "merchant_id", referencedColumnName: "userId" }])
  merchant: Merchant;

  @OneToMany(
    () => MerchantPspConfiguration,
    (merchantPspConfiguration) => merchantPspConfiguration.enabledPsp
  )
  merchantPspConfigurations: MerchantPspConfiguration[];

  @OneToMany(
    () => RoutingConfiguration,
    (routingConfiguration) => routingConfiguration.psp
  )
  routingConfigurations: RoutingConfiguration[];

  @OneToMany(() => TransactionData, (transactionData) => transactionData.psp)
  transactionData: TransactionData[];
}
