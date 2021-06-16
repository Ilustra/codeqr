
import api from '../services/api';
import {getToken} from './getToken'
export async function getBallance(userId) {
    return await api.get('ballance/' + userId, await getToken()
  );
}
  