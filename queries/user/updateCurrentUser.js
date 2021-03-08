import {pgCleanString, pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const updateCurrentUser = async (user) => {
  const label = 'update current user';

  // Update the current user's main db record to match what's in cognito
  const params = [
    user.userParams.Username,
    pgCleanString(user.email),
    pgCleanString(user.name),
    JSON.stringify(user.roles),
  ]
  const sql = `
    UPDATE ${userTables.main}
    SET
      email = $2,
      name = $3,
      roles = $4,
      updated_at = NOW(),
      updated_by = $1
    WHERE id = $1
    RETURNING *;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default updateCurrentUser;
