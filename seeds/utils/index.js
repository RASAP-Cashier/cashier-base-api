const path = require("path");

const checkSeedExist = (knex, fileName) => {
  return knex("knex_seeds").where({ file_name: fileName }).first();
};

const createKnexSeed = (knex, fileName) => {
  return knex("knex_seeds").insert({ file_name: fileName });
};

async function isSeedAvailable(knex, fileName) {
  const lock = await knex("knex_seeds_lock").where("id", 1).forUpdate().first();

  if (lock && lock.is_locked) {
    console.log(fileName + " Seeding is currently locked.");
    return false;
  }

  const seedIsExist = await checkSeedExist(knex, fileName);

  return !seedIsExist;
}

module.exports = {
  checkSeedExist,
  createKnexSeed,
  isSeedAvailable,
};
