import api from '../services/api';
import {getToken} from './getToken'

export async function onCreate(value) {
    return await api.post('login/User', {
      nome: value.nome,
      email: value.email,
      password: value.password,
    });
}
export async function onCreateSocial(email, name, uid, provider, password, token){
  return await api.post ('user/register', {
    email, name, uid, provider, password
  }, 
  {
    'headers':{
          'authorization': token,
        'provider': provider
    }
  }
  )
}
export async function onUser(email) {
  return await api.get('user/'+email, await getToken() );
}

