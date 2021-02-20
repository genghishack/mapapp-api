import {pgQuery} from "../../lib/postgres-lib";

const getResource = async (id) => {
  const label = 'get resource by id';
  const sql = `
    SELECT id, name, address_json, latlng
    FROM ${resourceTable}
    WHERE id = $1
  `;

  try {
    return await pgQuery(sql, [id], label);
  } catch (e) {
    return Promise.reject(e);
  }
};

export default getResource;
