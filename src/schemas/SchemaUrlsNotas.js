export default class SchemaUrlsNotas {
  static schema = {
    name: 'UrlNota',
    primaryKey: 'id',
    properties: {
      id: {type: 'string', indexed: true},
      url: {type: 'string'},
      state: {type: 'bool', default: false},
      createdAt: {type: 'date'},
    },
  };
}
