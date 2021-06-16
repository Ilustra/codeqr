import getRealm from '../services/realm';

export async function saveNotasNFE(repository) {
  const data = {
    id: repository._id,
    nome: repository.nome,
    cnpj: repository.cnpj,
    endereco: repository.endereco,
    pagamento: repository.pagamento,
    valorPago: repository.valorPago,
    url: repository.url,
    user: repository.user,
    createdAt: repository.createdAt,
    produtos: repository.produtos,
  };
  const realm = await getRealm();

  realm.write(() => {
    realm.create('NotasNFE', data, 'modified');
  });
}
export async function updateUrlNota(url) {
  const Realm = await getRealm();
  const data = {
    url: url,
    estado: true,
  };
  Realm.write(() => {
    Realm.create('UrlNota', data, 'modified');
  });
}

export async function saveGetNotas() {
  const Realm = await getRealm();
  const notas = Realm.objects('NotasNFE');
  return notas;
}
