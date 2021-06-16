export default class ProdutoDespensa {
  constructor(id, _id, nome, quantidade, un, user) {
    this.id = id;
    this._id = _id;
    this.nome = nome;
    this.quantidade = quantidade;
    this.UN = un;
    this.user = user;
    this.updatedAt = new Date();
  }
}
