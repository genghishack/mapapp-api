import {pgQuery} from "../../lib/postgres-lib";

const getResources = async () => {
  const label = 'list resources';
  const sql = `
    SELECT id, name, address_json, latlng
    FROM gis_resource
  `;

  try {
    const result = await pgQuery(sql, [], label);
    return result;
  } catch (e) {
    return Promise.reject(e);
  }
};

export default getResources;
