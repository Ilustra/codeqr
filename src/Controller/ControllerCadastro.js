import api from '../services/api';
import {getToken} from './getToken'

export async function modifyPassword(id, old, newPass, conf) {
    return await api.post('user/modify_password/',
    {
        id: id,
        oldpassword: old, 
        newpassword: newPass
    }, await getToken());

}
export async function getCadastro(id) {
    return await api.get('cadastro/' + id,  await getToken());
}
export async function onCreate(
    user,
    firstName, 
    lastName, 
      email,
      cep, 
      ddd, 
      phone, 
      localidade,
      bairro, 
      uf, 
) {
    return await api.post('cadastro/', {
        user,
        firstName, 
        lastName, 
          email,
          cep, 
          ddd, 
          phone, 
          localidade,
          bairro, 
          uf, 
    },  await getToken());
}
