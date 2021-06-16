export default class NotasSchema {
  static schema = {
    name: 'NotasNFE',
    primaryKey: 'id',
    properties: {
      id: {type: 'string', indexed: true},
      nome: {type: 'string'},
      cnpj: {type: 'string'},
      endereco: {type: 'string'},
      dispensa: {type: 'bool', default: false},
      pagamento: {type: 'string'},
      valorPago: {type: 'float'},
      user: {type: 'string'},
      createdAt: {type: 'string'},
      url: {type: 'string'},
      produtos: 'Produto[]',
    },
  };
}
