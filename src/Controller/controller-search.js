
import api from '../services/api';
import {getToken} from './getToken'
export async function getProducts(name, localidade) {
    return await api.get('search/' + name
    + `?localidade=${localidade}`,
    await getToken()
    );
  }
  