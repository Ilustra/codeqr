import api from '../services/api';
import getRealm from '../services/realm'

import {getToken} from './getToken'

export async function sendReport(title, description, note) {
    const realm = await getRealm();
     const user = realm.objects('User')
     const id = user[0]._id
    return await api.post('report/', {
        title, description, note, id
    },
    await getToken()
    );

}
