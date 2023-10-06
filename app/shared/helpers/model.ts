import { Knex } from "knex";
import { Expression, Model, PrimitiveValue, QueryBuilder, Transaction } from "objection";

import { ModelRelation, ModelWhereWithIn } from "../../interfaces";

/*
 * Objection has different methods for `where`: where, whereIn
 * `formQueryBuilderWhere` can be used for using both single and multiple values for the column
 *
 * Example:
 * `formQueryBuilderWhere(User.query(), where).update(payload);` -
 * can be used with `where = { id: 5 }`, or `where = { id: [5, 6] }`
 */
export const formQueryBuilderWhere = <T extends Model>(queryBuilder: QueryBuilder<T>, where: ModelWhereWithIn<T>) => {
  Object.entries(where).forEach(([prop, val]: [string, Expression<PrimitiveValue>]) => {
    if (Array.isArray(val)) {
      queryBuilder.whereIn(prop, val);
    } else {
      queryBuilder.where(prop, val);
    }
  });

  return queryBuilder;
};

const joinRelation = ({ relation, modifier, relations = [] }: ModelRelation) => {
  let relString = `${relation}${modifier ? `(${modifier})` : ""}`;
  if (relations.length > 0) {
    const childRelations = relations.map((relation) => joinRelation(relation));
    relString += `.[${childRelations.join()}]`;
  }
  return relString;
};

/*
 * Method can be used for common `find` operations both for a single and multiple items
 *
 * Example:
 *
 * export const getSubscription = (
 *   where: ModelWhereWithIn<Subscription>,
 *   relations: ModelRelation[] = [],
 *   transaction?: Transaction,
 * ) => findEntities(Subscription, where, true, relations, transaction);
 *
 * export const getSubscriptions = (
 *   where: ModelWhereWithIn<Subscription>,
 *   relations: ModelRelation[] = [],
 *   transaction?: Transaction,
 * ) => findEntities(Subscription, where, false, relations, transaction);
 */
export function findEntities<T extends Model>(
  model: typeof Model,
  where: ModelWhereWithIn<T>,
  singleItem: true,
  relations: ModelRelation[],
  transaction?: Knex,
): QueryBuilder<T, T>;
export function findEntities<T extends Model>(
  model: typeof Model,
  where: ModelWhereWithIn<T>,
  singleItem: false,
  relations: ModelRelation[],
  transaction?: Knex,
): QueryBuilder<T, T[]>;
export function findEntities<T extends Model>(
  model: typeof Model,
  where: ModelWhereWithIn<T>,
  singleItem = false,
  relations: ModelRelation[],
  transaction?: Transaction,
) {
  const query = formQueryBuilderWhere(model.query(transaction), where);
  if (singleItem) {
    query.first();
  }
  relations.forEach((relation) => {
    query.withGraphFetched(joinRelation(relation));
  });
  return query;
}
