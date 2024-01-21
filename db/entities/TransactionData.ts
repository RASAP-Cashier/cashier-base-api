import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GlobalPspConfiguration } from "./GlobalPspConfiguration";
import { Merchant } from "./Merchant";

@Index("transaction_data_pkey", ["transactionId"], { unique: true })
@Entity("transaction_data", { schema: "public" })
export class TransactionData {
  @PrimaryGeneratedColumn({ type: "integer", name: "transaction_id" })
  transactionId: number;

  @Column("character varying", {
    name: "transaction_type",
    nullable: true,
    length: 255,
  })
  transactionType: string | null;

  @Column("character varying", {
    name: "trace_id",
    nullable: true,
    length: 255,
  })
  traceId: string | null;

  @Column("character varying", {
    name: "payment_method",
    nullable: true,
    length: 255,
  })
  paymentMethod: string | null;

  @Column("numeric", {
    name: "amount",
    nullable: true,
    precision: 10,
    scale: 2,
  })
  amount: string | null;

  @Column("character varying", { name: "currency", nullable: true, length: 3 })
  currency: string | null;

  @Column("character varying", {
    name: "payment_processor",
    nullable: true,
    length: 255,
  })
  paymentProcessor: string | null;

  @Column("character varying", {
    name: "card_token",
    nullable: true,
    length: 255,
  })
  cardToken: string | null;

  @Column("timestamp without time zone", { name: "timestamp", nullable: true })
  timestamp: Date | null;

  @Column("character varying", {
    name: "psp_transaction_id",
    nullable: true,
    length: 255,
  })
  pspTransactionId: string | null;

  @Column("character varying", {
    name: "card_type",
    nullable: true,
    length: 50,
  })
  cardType: string | null;

  @Column("integer", { name: "attempts_amount", nullable: true })
  attemptsAmount: number | null;

  @Column("character varying", {
    name: "transaction_status",
    nullable: true,
    length: 255,
  })
  transactionStatus: string | null;

  @Column("character varying", {
    name: "order_id",
    nullable: true,
    length: 255,
  })
  orderId: string | null;

  @Column("timestamp without time zone", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp without time zone", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @ManyToOne(
    () => GlobalPspConfiguration,
    (globalPspConfiguration) => globalPspConfiguration.transactionData
  )
  @JoinColumn([{ name: "psp_id", referencedColumnName: "pspId" }])
  psp: GlobalPspConfiguration;

  @ManyToOne(() => Merchant, (merchant) => merchant.transactionData)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Merchant;
}
