import getRealm from '../services/realm'
export async function getToken(){
      const realm = await getRealm();
      const user = realm.objects('User')
      return {
            'headers':{
                'authorization': user[0].token,
                'provider':  user[0].provider
            }

      }

}