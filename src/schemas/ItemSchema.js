var uuid = require('react-native-uuid');
export default class ItemSchema {
  static schema = {
    name: 'Item',
    primaryKey: 'id',
    properties: {
      _id: {type: 'string', default: '' },
      id: {type: 'string', indexed: true, default: uuid.unparse(uuid.v1())},
      nome: {type: 'string'},
      quantidade: {type: 'float'},
      valor: {type: 'float', default: 0},
      total: {type: 'float', default: 0},
      UN: {type: 'string', default: 'UN'},
      user: {type: 'string', default: ''},
      select: {type: 'bool', default: false},
      updatedAt: {type: 'date',default: new Date()},
    },
  };
}
