export default class SchemaMeta {
  static schema = {
    name: 'Meta',
    primaryKey: 'mes',
    properties: {
      id: {type: 'string'},
      valor: {type: 'float'},
      mes: {type: 'int', indexed: true},
      valorGastro: {type: 'float', default: 0},
    },
  };
}
