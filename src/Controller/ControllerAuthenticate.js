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
