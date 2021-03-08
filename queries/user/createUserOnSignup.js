import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const createUserOnSignup = async (user) => {
  const label = 'create user on signup';
  let params = [
    user.userParams.Username,
    user.userIdentity.federatedId,
    pgCleanString(user.email),
    pgCleanString(user.name),
    JSON.stringify(user.roles),
  ];

  const sql = `
    INSERT INTO ${userTables.main}
    (
      id, 
      federated_id, 
      email,
      name,
      roles,
      created_at, 
      created_by, 
      updated_at, 
      updated_by
    )
    VALUES ($1, $2, $3, $4, $5, NOW(), $1, NOW(), $1)
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
}

export default createUserOnSignup;
