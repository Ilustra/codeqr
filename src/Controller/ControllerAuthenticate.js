import api from '../services/api';

import {getToken} from './getToken'
export async function Authenticate(email, password) {
    return await api.post('login/authenticate', {
      email: email,
      password: password,
    })
}
export async function checkAuth() {
    return await api.get('/',  await getToken())
}


export async function authManu(email, password){
  
  return await api.post('https://adb.md.utfpr.edu.br/api/data/v2/auth/login',{
    email: email,
    password: password,
  })
}