var uuid = require('react-native-uuid');
export default class DespesaSchema {
  static schema = {
    name: 'Despesa',
    primaryKey: 'id',
    properties: {
      id: {type: 'string', indexed: true, default: uuid.unparse(uuid.v1())},
      descricao: {type: 'string'},
      valor: {type: 'float'},
      categoria: {type: 'string', default: ''},
      updatedAt: {type: 'date',default: new Date()},
    },
  };
}
