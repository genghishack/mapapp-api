export const resourceColumns = `
      id, 
      status_id,
      name_json,
      address_json,
      phone_json,
      internet_json,
      other_json,
      description,
      lat, 
      lng,
      shape,
      created_at,
      created_by,
      updated_at,
      updated_by
`;

export const selectResource = `
    SELECT ${resourceColumns}
    FROM app.gis_resource
`;
