import {pgQuery} from "../../lib/postgres-lib";
import {reject} from "../../lib/error-lib";
import {selectResource} from './common';

const getResource = async (id) => {
  const label = 'get resource by id';
  const params = [id];
  const sql = `
    ${selectResource}
    WHERE id = $1
  `;

  try {
    return pgQuery(sql, params, label);
  } catch (e) {
    return reject(e);
  }
};

export default getResource;
