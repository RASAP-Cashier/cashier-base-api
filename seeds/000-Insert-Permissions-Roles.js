/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const path = require("path");
const { createKnexSeed, isSeedAvailable } = require("./utils");

const roles = [
  {
    name: "admin",
    description: "Admin has all the rights and can manage everything.",
    created_by: "System",
  },
  {
    name: "user",
    description: "User has limited rights and can only view data.",
    created_by: "System",
  },
];

const permissions_payload = [
  {
    name: "create_day",
    description: "Allows the user to create a day.",
    created_by: "System",
  },
  {
    name: "edit_day",
    description: "Allows the user to edit an existing day.",
    created_by: "System",
  },
  {
    name: "delete_day",
    description: "Allows the user to delete a day.",
    created_by: "System",
  },
];

exports.seed = async function (knex) {
  const fileName = path.basename(__filename);
  const is_seed_available = await isSeedAvailable(knex, fileName);

  if (!is_seed_available) return;

  knex.transaction(async (trx) => {
    try {
      await trx("knex_seeds_lock").where("id", 1).update({ is_locked: true });

      await Promise.all([await trx("roles").insert(roles), await trx("permissions").insert(permissions_payload)]);

      const [adminRole, permissions] = await Promise.all([
        trx("roles").where({ name: "admin" }).first(),
        trx("permissions"),
      ]);

      await Promise.all(
        permissions.map(async (permission) => {
          await trx("role_permissions").insert({
            role_id: adminRole.id,
            permission_id: permission.id,
          });
        }),
      );

      return createKnexSeed(trx, fileName);
    } catch (error) {
      trx.rollback();
      console.log(error);
    } finally {
      await trx("knex_seeds_lock").where("id", 1).update({ is_locked: false });
    }
  });
};
