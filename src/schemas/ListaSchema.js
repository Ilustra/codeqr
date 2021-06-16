var uuid = require('react-native-uuid');
export default class ListaSchema {
  static schema = {
    name: 'Lista',
    primaryKey: 'id',
    properties: {
      id: {type: 'string', indexed: true, default: uuid.v1()},
      _id: {type: 'string', default: '' },
      user: {type: 'string', default: ''},
      nome: {type: 'string', default: ''},
      descricao: {type: 'string', default: ''},
      padrao: {type: 'bool', default: false},
      updatedAt: {type: 'date', default: new Date()},
      userUpdated: {type: 'string', default:''},
      tipo: {type: 'string'},
      items: {type: 'list', objectType: 'Item'},
    },
  };
}
