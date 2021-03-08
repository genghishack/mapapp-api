import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import constants from "../../constants";

const userTables = constants.tables.user;

const getUsers = async (userIds = []) => {
  const label = 'list users';
  const params = userIds;

  let whereClause = '';
  if (userIds.length) {
    const whereArr = params.map((value, index) => {
      return `$${index + 1}`;
    });
    whereClause = `WHERE id IN (${whereArr.join(',')})`;
  }

  const sql = `
    SELECT * from ${userTables.main}
    ${whereClause};
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getUsers;
