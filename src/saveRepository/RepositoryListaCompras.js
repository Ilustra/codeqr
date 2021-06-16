import getRealm from '../services/realm';
import {Alert} from 'react-native';

export async function UpdateItem(repository) {
  const data = {
    id: repository.id,
    nome: repository.nome,
    UN: repository.UN,
    quantidade: repository.quantidade,
    valor: repository.valor,
    total: repository.valor * repository.quantidade,
  };

  const realm = await getRealm();

  realm.write(() => {
    realm.create('Lista', data, 'modified');
  });
}

export async function Delete(repository) {
  const {id} = repository;

  const realm = await getRealm();
  const item = realm.objects('Lista').filtered(`id =${JSON.stringify(id)}`);

  realm.write(() => {
    realm.delete(item);
  });
}
export async function repo_getListaCompras() {
  const realm = await getRealm();
  return realm.objects('Lista');
}

export async function repoInsertItem(repository) {
  const realm = await getRealm();
  realm.write(() => {
    realm.create('Lista', repository, 'modified');
  });
}
