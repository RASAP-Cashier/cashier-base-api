import { Role, UserRole } from "../models";

/**
 * Role Service
 * @namespace RoleService
 */

/**
 * Function to find user roles by user id.
 * @function getRolesIdsByUser
 * @memberOf RoleService
 * @param {number} user_id - The id of the user.
 * @returns {Promise<number[]>} Returns a Promise that resolves to an array of role ids associated with the user.
 */
export const getRolesIdsByUser = async (user_id: number): Promise<number[]> => {
  const userRoles = await UserRole.query().where({ user_id });

  return userRoles.map((userRole) => userRole.role_id);
};

/**
 * Function to get a list of roles with their respective permissions based on provided role ids.
 * @function getRolesWithPermissionsByRoleIds
 * @memberOf RoleService
 * @param {number[]} roles - An array of role ids.
 * @returns {Promise<Role[]>} Returns a Promise that resolves to an array of Role objects each
 * containing respective permissions.
 */
export const getRolesWithPermissionsByRoleIds = async (roles: number[]): Promise<Role[]> => {
  const roles_list = await Role.query()
    .withGraphFetched({
      permissions: true,
    })
    .whereIn("id", roles);

  return roles_list;
};
