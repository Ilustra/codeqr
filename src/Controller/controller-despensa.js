
import api from '../services/api';
import {getToken} from './getToken'
//
export async function onCreateDespensa(user, name) {
    return await api.post('despensa/create',{user, name}, await getToken()
  );
}
export async function onGetDespensa(user) {
    return await api.get('despensa/'+ user, await getToken());
}
export async function onAddUserShare(userId, name, despensaId) {
    return await api.post('despensa/user',{userId, name, despensaId}, await getToken());
}
export async function onDeleteUserShare(despensaId, userId) {
    return await api.delete('despensa/user/'+despensaId +'/'+userId, await getToken()
  );
}
export async function onDeleteDespensa(despensaId, userId) {
    return await api.delete('despensa/'+despensaId+'/'+ userId, await getToken(), 
  );
}

//procedimentos feitos em items
export async function onPushProdutos(user, despensaId, items, dateUpdate, userName) {
    return await api.post('despensa/produto',{user, despensaId, items, dateUpdate, userName}, await getToken()
  );
}
export async function onDeleteItem(despensaId, itemId, userId) {
  return await api.delete('despensa/produto/'+ despensaId +'/'+itemId +'/'+ userId, await getToken());
}
export async function onUpdateItem(userId, itemId, status, openDate, nivel, updatedAt, name, UN, quantidade, valor, total,validade, updateUser, categoria) {
  return await api.put('despensa/produto',{
    userId, 
    itemId,
    status, 
    openDate, 
    nivel, 
    updatedAt, 
    name, 
    UN, 
    quantidade, 
    valor, 
    total,
    validade, 
    updateUser, 
    categoria
  }, await getToken());
}