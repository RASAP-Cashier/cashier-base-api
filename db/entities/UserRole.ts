import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";
import { Merchant } from "./Merchant";

@Index("user_role_pkey", ["userRoleId"], { unique: true })
@Entity("user_role", { schema: "public" })
export class UserRole {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_role_id" })
  userRoleId: number;

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

  @ManyToOne(() => Role, (role) => role.userRoles)
  @JoinColumn([{ name: "role_id", referencedColumnName: "roleId" }])
  role: Role;

  @ManyToOne(() => Merchant, (merchant) => merchant.userRoles)
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: Merchant;
}
