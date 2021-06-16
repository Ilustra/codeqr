import getRealm from '../services/realm';

//buscar produtos produto
export async function getProdutos(repository) {
  const realm = await getRealm();
  return realm.objects('Produto');
}
