import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Permissions } from "./Permissions";
import { Role } from "./Role";

@Entity("role_permissions", { schema: "public" })
export class RolePermissions {
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

  @ManyToOne(() => Permissions, (permissions) => permissions.rolePermissions)
  @JoinColumn([{ name: "permission_id", referencedColumnName: "permissionId" }])
  permission: Permissions;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn([{ name: "role_id", referencedColumnName: "roleId" }])
  role: Role;
}
