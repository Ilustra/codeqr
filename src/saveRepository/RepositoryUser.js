import getRealm from '../services/realm';

export async function createUser(nome, email, token, _id, password, despensa) {
  try {
    realm.write(()=>{
      return realm.create('User',{
        nome, email, token, _id, password,
        despensa
      })
    })
  
  } catch (error) {
    return error
  }
}
export async function getUserById(id) {
  const realm = await getRealm();
  const user = await realm.objects('User').fiiltered(`id=${id}`);
  return user;
}
export async function saveGetUser() {
  const realm = await getRealm();
  const user = await realm.objects('User');
  return user;
}
export async function saveUpdateUser(id, repository) {
  const data = {
    nome: repository.nome,
    id: id,
    email: repository.email,
    DDD: repository.DDD,
    telefone: repository.telefone,
    cep: repository.cep,
  };

  const realm = await getRealm();
  realm.write(() => {
    realm.create('User', data, 'modified');
  });
}
