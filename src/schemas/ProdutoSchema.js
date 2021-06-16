export default class ProdutoSchema {
  static schema = {
    name: 'Produto',
    primaryKey: '_id',
    properties: {
      id: {type: 'int'},
      _id: {type: 'string', indexed: true},
      nome: {type: 'string'},
      quantidade: {type: 'float'},
      UN: {type: 'string'},
      valor: {type: 'float'},
      total: {type: 'float'},
    },
  };
}
