export default {
  appName: 'mapapp',
  debug: true,
  regex: {
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    state: /^[A-Za-z]{2}$/, // e.g. NM
    date: /^\d{4}(\-(0?[1-9]|1[012]))?(\-(0?[1-9]|[12][0-9]|3[01]))?$/, //yyyy-mm-dd, yyyy-mm, yyyy
  },
  tables: {
    resource: {
      main: 'gis_resource'
    },
    user: {
      main: 'app_user'
    }
  }
};
