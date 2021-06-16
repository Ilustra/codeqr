import api from '../services/api';
import {getToken} from './getToken'
export async function RegisterNota(url, userId) {
  return await api.post('notas/register', {
    userId: userId,
    url: url,
  }, 
  await getToken() 
  );

}
export async function getNotas(userId, limit, skip, token) {
  
    return await api.get('notas/' + userId+`?limit=${
      limit
    }&skip=${
      skip
    }
    `,
    await getToken() 
    );

}
export async function onDelete(id){
  return await api.delete('notas/'+id,
  await getToken() 
  );
}
export async function getNotasMonth(userId, start, end) {

  return await api.post('notas/month/', {
      userId, start, end
    }, 
    await getToken() 
    );

}

export async function getMonth(userId, startTime, endTime) {
    return await api.post('notas/between/date', {
      userId: userId,
      start: startTime,
      end: endTime,
    }, 
    await getToken() 
    )
}
