import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import constants from "../../constants";
import {logDebug} from "../../lib/logging-lib";

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

  // logDebug({params});

  const sql = `
    INSERT INTO ${userTables.main}
    (
      id, 
      federatedId, 
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
    return await pgQuery(sql, params, label);
  } catch (e) {
    return Promise.reject(e);
  }
}

export default createUserOnSignup;
