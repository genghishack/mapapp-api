import constants from "../../constants";

const resourceTables = constants.tables.resource;

export const resourceColumns = `
      id, 
      name, 
      business_name,
      website,
      email,
      phone,
      fax,
      description,
      address_json, 
      latlng,
      approved_for_public,
      submitted_for_approval
`;

export const selectResource = `
    SELECT ${resourceColumns}
    FROM ${resourceTables.main}
`;
