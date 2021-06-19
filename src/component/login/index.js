import React, { useState, useEffect } from 'react';
//
import { Image, View, Text, StatusBar, ScrollView } from 'react-native';
import { Button, TextInput, Snackbar, Dialog, Portal, Surface } from 'react-native-paper';
import {
  Container,
  Box,
  Submit,
  BoxLogo,
} from './style';
//
//import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {onCreateSocial} from '../../Controller/ControllerUser';

import { ExpErr } from '../expecptions'
import AuthContext from '../../context/auth'
import getRealm from '../../services/realm';
var uuid = require('react-native-uuid');


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [forgot, setForgot] = useState('');
  const [password, setPassword] = useState('');

  const [isDialog, setIsdialog] = useState(false);
  const [isLogin, setIslogin] = useState(false);
  //
  const { signIn } = React.useContext(AuthContext);
  //
  const [isIndicator, setIsIndicator] = useState(false);


  const onToggleSnackBar = () => setVisibleSnack(!visible);

  const onDismissIndicator = () => setIsIndicator(false);
  const onDismissIsLogin = () => setIslogin(false)
  const hidleDialog = () => setIsdialog(!isDialog);
  const openDialog = () => setIsdialog(!isDialog);


  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('message');
  const [styleSnack, setStyleSnack] = useState(false)


  useEffect(() => {
    async function t(){
      try {
        const realm = await getRealm();
        const objectUser = realm.objects('User')
        if(objectUser.length){
          setEmail(objectUser[0].email)
          setPassword(objectUser[0].password)
        }
      } catch (error) {
        console.log(error)
      }
    }
    t();
  }, []);


  const onDismissSnackBar = () => setVisibleSnack(false);
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }


  async function onSingIn(textEmail, textPassword) {
    setIslogin(true);
    if (textEmail != '' && textPassword != '') {
      await auth().signInWithEmailAndPassword(textEmail, textPassword)
      .then(async(response) => {
        const {displayName, email, uid, providerId, photoURL} = response.user
        // Signed in
        const user = auth().currentUser
        const token = await user.getIdToken()
       await createUsersocial(email, displayName, uid, providerId, password, token, 'photoURL')
      })
      .catch((error) => {
        setIslogin(false);
        var errorCode = error.code;
        var errorMessage = error.message;
        onSnack(true, errorMessage.message, false)
      });
    } else {
      onDismissIsLogin()
      onSnack(true, 'Campos inválidos', false)
    }
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    // Sign-in the user with the credential
    return  auth().signInWithCredential(facebookCredential);
  }

  function Navigate(string) {
    navigation.navigate(string)
  }


  async function recoveryPassword(email) {
    setIsIndicator(true)
    await auth().sendPasswordResetEmail(email);
    onSnack(true, 'e-mail de redefinição de senha enviado', true);
    hidleDialog()
    onDismissIndicator()


  }
  async function createUsersocial(email, displayName, uid, providerId, password, token, photoURL){
    const realm = await getRealm();
    await onCreateSocial(email, displayName, uid, providerId, password, token)
    .then(async response=>{
      const {_id} = response.data
      try {
        realm.write(() => {
          realm.create('User', {
            name: displayName ? displayName: '', 
            email, 
            token, 
            _id: _id, 
            uid: uid, 
            provider: providerId, 
            token,
            photoURL: photoURL ? photoURL : '',
            password
          }, 'modified')
        })  
        await signIn({ token: token });
      } catch (error) {

        const {response} = error
        onSnack(true, ExpErr(response.status, response.data), false)
      }
    })
    .catch(e=>{
      const {response} = e
      onSnack(true, ExpErr(response.status, response.data), false)
    })
  }
  return (
   <Surface style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <Container>
        <BoxLogo>
          <Image
            style={{ width: 100, height: 143, alignItems: 'center' }}
            source={require('../../image/icon-xxxhdpi.png')}
          />
          <Text style={{ fontWeight: 'bold', fontSize: 32, color: '#000' }}>DESPENSA</Text>
        </BoxLogo>
        <Box style={{ flex: 2 }}>
          <Box style={{ padding: 10, alignItems:'center'}}>
            <TextInput
          keyboardType="email-address"
              label="Email"
              style={{ backgroundColor: '#fff', borderColor: '#c7c7c7', width:'80%', }}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={{ backgroundColor: '#fff', borderColor: '#fafafa', width: '80%', textAlign:'center',  }}
              label="Senha"
              secureTextEntry={true}  
              value={password}
              onChangeText={setPassword}
            />
            <Submit
                style={{ }}
                color="#505050"
                style={{fontSize: 11}}
                onPress={() => openDialog()}>
                <Text>Esqueci minha senha</Text>
            </Submit>
            
           
          </Box>

          <Box style={{ flexDirection:'column', justifyContent:'space-between', flex: 1, padding: 10}}>

            <Box style={{justifyContent:'center', alignItems:'center'}}>
              <Button
                loading={isLogin}
                color="#fc6500"
                style={{width: 120, color: '#fff', margin: 10}}
                icon="send"
                mode="contained"
                onPress={() => onSingIn(email, password)}>
                entrar
            </Button>
              <Button
                style={{ margin: 10}}
                color="#000"
                
                onPress={() => Navigate('Name')}>
               Cadastre-se
            </Button>
            </Box>
          
            <View style={{ justifyContent: 'center',padding: 0 }}>
            <Text style={{textAlign:'center', fontSize: 12}}>Login from </Text>
                <Button
                  icon="facebook"    
                  title="Facebook Sign-In"
                  color="#3b5998"
                  onPress={ () => onFacebookButtonPress().then(async response => {
                    try {
                      console.log(response.user)
                      const user = auth().currentUser
                      const token = await user.getIdToken()
                      const {displayName, email, uid, providerId} = response.user
                      const password = uuid.v1()
                      await createUsersocial(email, displayName, uid, providerId, password, token, user.photoURL)
                    } catch (error) {
                      auth().signOut()
                      onSnack(true, 'Ops! algo inesperado aconteceu, tente novamente', false)
                    }
                  }).catch(e => {
                    auth().signOut()
                    console.log('e', e)
                    onSnack(true, e, false)
                  })}
                >Facebook</Button>
              </View>           
          </Box>
        </Box>

        <Portal>
          <Dialog visible={isDialog} onDismiss={hidleDialog}>
            <Dialog.Content>
              <TextInput
                label="e-mail"
                mode="outlined"
                keyboardType="email-address"
                value={forgot}
                onChangeText={setForgot}
              />
              <Button
                mode='contained'
                style={{ marginTop: 20 }}
                loading={isIndicator}
                color="#c7c7c7"
        
                onPress={() => recoveryPassword(forgot)}>
                Enviar
            </Button>
              <Box>
              </Box>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </Container>
     
      <Snackbar
        visible={visibleSnack}
        style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#f64a4a' }}
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
