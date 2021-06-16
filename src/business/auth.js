import React from 'react';
import AuthContext from '../context/auth'
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import getRealm from '../services/realm'
import {onCreateSocial} from '../Controller/ControllerUser';
export default class UserAuth {


    constructor(_id, email, password) {
        this._id = _id;
        this.email = email;
        this.password = password;
    }
    get statusAutht(){

    }
    singIn(){
        const { signIn } = React.useContext(AuthContext);
    }
    logout(){
    }

    async onSingIn() {
        const realm = await getRealm();
        if (this.email != '' && this.password != '') {
          await auth().signInWithEmailAndPassword(this.email, this.password)
          .then(async(response) => {
            const {displayName, email, uid, providerId, photoURL} = response.user
            // Signed in
            const user = auth().currentUser
         // await createUsersocial(email, displayName, uid, providerId, password, await user.getIdToken(), 'photoURL')
            const token = await user.getIdToken();
            try {
                realm.write(() => {
                    realm.create('User', {
                      name: displayName ? displayName: '', 
                      email, 
                      token, 
                      _id: this._id, 
                      uid: uid, 
                      provider: providerId, 
                      token ,
                      photoURL: 'photoURL',
                      password: this.password
                    }, 'modified')
                })
            } catch (error) {
                console.log(error)
            }

        })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error)
            console.log('errorCode',errorCode)
          });
        } 
      }
    

}