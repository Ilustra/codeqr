import React, { useState } from 'react';

import { Button, TextInput, Snackbar, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, Text } from 'react-native'

import  AuthContext from '../../context/auth';

import auth from '@react-native-firebase/auth';
import getRealm from '../../services/realm';
import { onCreateSocial } from '../../Controller/ControllerUser';
import { ExpErr } from '../expecptions'; 

export default function Password({ route, navigation }) {
  const { signIn } = React.useContext(AuthContext);
    const [isLogin, setIslogin] = useState(false)
    const [password, setPassword] = useState('')
    const [confirPassword, setConfirmPassowrd] = useState('')
    const {id, name, email} = route.params
  //
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('message');
  const [styleSnack, setStyleSnack] = useState(false)
  const onDismissSnackBar = () => setVisibleSnack(false);
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }
  async function createUsersocial(email, name, uid, providerId, password, token, photoURL){
    const realm = await getRealm();
    await onCreateSocial(email, name, uid, providerId, password, token, )
    .then(async response=>{
      const {_id} = response.data
      console.log(response.data)
      try {
        realm.write(() => {
          realm.create('User', {
            name: name ? name: '', 
            email, 
            token, 
            _id: _id, 
            uid: uid, 
            provider: providerId, 
            token,
            photoURL: photoURL ? photoURL: '',
            password
          }, 'modified')
        })  
        await signIn({ token: token });
      } catch (error) {
        const {response} = error
        setIslogin(false)
        onSnack(true, 'Cadastro realizado com sucesso!', false)
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1200);


      }
    })
    .catch(e=>{
      onSnack(true, ExpErr(response.status, response.data), false)
    })
  }
   async function confirmar(name, email, senha, confSenha){
      setIslogin(true)
      if(senha != confSenha){
        setIslogin(false)
        onSnack(true, 'Senhas não conferem!', false)
      }else{
        await auth().createUserWithEmailAndPassword(email, password).then(async response=>{
          var user = await auth().currentUser;
          const {displayName, email, uid, providerId} = response.user
          const token = await user.getIdToken()
              user.updateProfile({
                displayName: name,
              }).then(async () => {
                await createUsersocial(email, name, uid, providerId, password, token, user.photoURL)
              }).catch(function(error) {
                // An error happened.
                setIslogin(false)
              // console.log(error)
                var errorCode = error.code;
                var errorMessage = error.message;
                onSnack(true, errorMessage, false);
              });
        }).catch(error=>{
          setIslogin(false)
          var errorCode = error.code;
          var errorMessage = error.message;
          if(errorCode == 'auth/email-already-in-use'){
           onSnack(true, 'esse e-mail já está sendo usado!', false)
          }
          if(errorCode == 'auth/weak-password'){
            onSnack(true, 'senha fraca, deve conter no mino 6 caracter', false)
          }
          onSnack(true, errorMessage, false);
        })
      }

    }
    return (
        
        <Surface style={{ flex: 1, backgroundColor: '#fc6500' }}>
           
                <View style={{ flexDirection: "column", flex: 1, justifyContent:'space-between', padding: 10 }}>
                    <View ></View>
                
                        <Text style={{ fontSize: 22, textAlign: 'center' }}>Infome uma senha</Text>
                        <TextInput
                            label="senha"
                            style={{
                                backgroundColor: '#fc6500',
                                fontSize: 28,
                             
                            }}
                            secureTextEntry={true}  
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Text style={{fontSize: 11, textAlign:'center', marginTop: -20}}>Senha deve conter no mínimo 6 caracter</Text>     
                        <TextInput
                            label="confirme sua senha"
                            style={{
                                backgroundColor: '#fc6500',
                                fontSize: 28
                            }}
                            secureTextEntry={true}  
                            value={confirPassword}
                            onChangeText={setConfirmPassowrd}
                        />     
                        <Button          loading={isLogin} color='#fff' onPress={()=>{confirmar(name, email, password, confirPassword)}}>{isLogin ? 'aguarde' : 'confirmar'}</Button>
                  
                <View></View>
                </View>
                  <Snackbar
        visible={visibleSnack}
        style={styleSnack ? { backgroundColor: '#00C441' } : {  }}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Sair',
          onPress: () => { onDismissSnackBar() }
        }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          {messageSnack}
        </Text>
      </Snackbar>
        </Surface>

    );
}
