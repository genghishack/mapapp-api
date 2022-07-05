import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";

const getUser = async (id) => {
  const label = 'get user by id';
  let params = [id]

  const sql = `
    SELECT * from app.user
    WHERE id = $1;
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getUser;
