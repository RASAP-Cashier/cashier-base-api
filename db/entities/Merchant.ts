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
import { Kyb } from "./Kyb";
import { SubscriptionType } from "./SubscriptionType";
import { MerchantPspConfiguration } from "./MerchantPspConfiguration";
import { MerchantWidgetConfiguration } from "./MerchantWidgetConfiguration";
import { RoutingConfiguration } from "./RoutingConfiguration";
import { TransactionData } from "./TransactionData";
import { UserRole } from "./UserRole";

@Index("merchant_pkey", ["userId"], { unique: true })
@Entity("merchant", { schema: "public" })
export class Merchant {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Column("character varying", {
    name: "username",
    nullable: true,
    length: 255,
  })
  username: string | null;

  @Column("boolean", { name: "is_active", nullable: true })
  isActive: boolean | null;

  @Column("character varying", {
    name: "password",
    nullable: true,
    length: 255,
  })
  password: string | null;

  @Column("character varying", {
    name: "merchant_level",
    nullable: true,
    length: 255,
  })
  merchantLevel: string | null;

  @Column("character varying", { name: "email", nullable: true, length: 255 })
  email: string | null;

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

  @OneToMany(
    () => GlobalPspConfiguration,
    (globalPspConfiguration) => globalPspConfiguration.merchant
  )
  globalPspConfigurations: GlobalPspConfiguration[];

  @OneToMany(() => Kyb, (kyb) => kyb.user)
  kybs: Kyb[];

  @ManyToOne(
    () => SubscriptionType,
    (subscriptionType) => subscriptionType.merchants
  )
  @JoinColumn([
    {
      name: "subscription_type_id",
      referencedColumnName: "subscriptionTypeId",
    },
  ])
  subscriptionType: SubscriptionType;

  @OneToMany(
    () => MerchantPspConfiguration,
    (merchantPspConfiguration) => merchantPspConfiguration.merchant
  )
  merchantPspConfigurations: MerchantPspConfiguration[];

  @OneToMany(
    () => MerchantWidgetConfiguration,
    (merchantWidgetConfiguration) => merchantWidgetConfiguration.merchant
  )
  merchantWidgetConfigurations: MerchantWidgetConfiguration[];

  @OneToMany(
    () => RoutingConfiguration,
    (routingConfiguration) => routingConfiguration.merchant
  )
  routingConfigurations: RoutingConfiguration[];

  @OneToMany(() => TransactionData, (transactionData) => transactionData.user)
  transactionData: TransactionData[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
