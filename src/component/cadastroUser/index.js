import React, {useState} from 'react';

import {Button, TextInput, Snackbar, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native'
//
import {AuthContext} from '../../routes';
//
import { Text} from 'react-native';
import {Container, Body, BoxRow, Box} from './style';

//
import {onCreate} from '../../Controller/ControllerUser';

import {ExpErr} from '../expecptions'


export default function CadastroUser({navigation: {navigate}}) {
  //
  const {signUp} = React.useContext(AuthContext);
  //
  const [nome, setNome] = useState(null);
  const [email, setEmail] = useState(null);
  const [lengthHeight, setlengthHeight] = useState(50);
  const [password, setPassword] = useState(null);
  const [confirPassword, setConfirmPassword] = useState(null);
  //
  const [messageSucess, setMessageSucess] = useState(false);
  const [errorPassword, setErrorPassowrd] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [error, setError] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewPassword, setViewPassword] = useState(true);
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



  async function onRegister() {
    let isValid = false;
    const data = {
      nome,
      email,
      password,
    };
  
    setIsloading(true);

    isValid = validateEmail(email);
    isValid = validadePassword(password, confirPassword);
    isValid = validadeForm();
    //
    if (isValid) {
      await onCreate(data).then(async response=>{
        const {nome, email, token, _id} = response
        try {
          realm.write(()=>{
            return realm.create('User',{
              nome, email, token, _id, password,
              despensa: despensa[0]._id
            })
          })
          await signIn({token: token})
        } catch (error) {
          onSnack(true, "Seu cadastro foi realizado com sucesso", true)
          setTimeout(() => {
            onSnack(true, "faça seu login na tela principal", false)
          }, 1000);
        
        }

      }).catch(e=>{
        const {response} = e
        onSnack(true,ExpErr(response.status, response.data), false)
      });

    }
  }
  function validadeForm() {
    if (nome && email && password && confirPassword) {
      return true;
    } else {
      setMessageError('Por favor preencha todos os campos corretamente!!');
      setError(true);
      return false;
    }
  }
  function validadePassword(password1, password2) {
    if (password1 != password2) {
      setErrorPassowrd(true);
      setMessageError('Senhas não confere!');
      return false;
    } else {
      setErrorPassowrd(false);
      return true;
    }
  }
  function validateEmail(text) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(text) === false) {
      setErrorEmail(true);
      setMessageError('e-mail inválido!!!');
      return false;
    } else {
      setErrorEmail(false);
      return true;
    }
  }

  function MenssagemError() {
    setTimeout(() => {
      setIsloading(false);
    }, 2500);
    setError(true);
    return (
      <Box style={{marginTop: 35}}>
        <Text style={{textAlign: 'center', color: '#f64a4a'}}>
          {messageError}
        </Text>
      </Box>
    );
  }
  function MenssagemSucess() {
    setTimeout(() => {
      setIsloading(false);
    }, 2500);
    return (
      <Box style={{marginTop: 5}}>
        <Text style={{textAlign: 'center', color: '#00C441'}}>
          {messageSucess}
        </Text>
      </Box>
    );
  }
  function view() {
    setTimeout(() => {
      setViewPassword(true);
    }, 800);
    setViewPassword(false);
  }
  return (
    <Surface style={{flex: 1}}>
      <ScrollView>
    <Body style={{margin: 10, padding: 10}}>

        <TextInput
          label="Nome"
          style={{
            backgroundColor: '#fff',
          }}
          mode='outlined'
          value={nome}
          onChangeText={setNome}
        />

        <BoxRow
          style={{

            width: 250,
            marginTop: 20,
            marginBottom: 5,
          }}>
          <Icon name="email" size={20} color="#909090" />
          <Text style={{color: '#909090', marginLeft: 5, fontSize: 16}}>
            endereço de e-mail
          </Text>
        </BoxRow>
        <TextInput
          label="email"
          style={{
            backgroundColor: '#fff',

          }}
          error={errorEmail}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <BoxRow
          style={{
            width: 250,
            marginTop: 20,
            marginBottom: 10,
          }}>
          <Icon name="security" size={20} color="#909090" />
          <Text style={{color: '#909090', marginLeft: 5, fontSize: 16}}>
            Segurança
          </Text>
        </BoxRow>
        <BoxRow style={{alignItems: 'center', justifyContent: 'center'}}>
          <Box style={{width: '70%'}}>
            <TextInput
              label="senha"
              style={{
                backgroundColor: '#fff',
              }}
              placeholder=" informe uma senha"
              value={password}
              secureTextEntry={viewPassword}
              error={errorPassword}
              onChangeText={setPassword}
            />
            <TextInput
              label="Confirme sua senha"
              style={{
                backgroundColor: '#fff',
              }}
              placeholder="repita a senha informada a cima"
              value={confirPassword}
              secureTextEntry={viewPassword}
              error={errorPassword}
              onChangeText={setConfirmPassword}
            />
          </Box>
          <Button onPress={() => view()}>
            <Icon name="visibility" size={30} color="#000" />
          </Button>
        </BoxRow>
        <MenssagemError />
        <MenssagemSucess />
  
      <Box style={{justifyContent:'center', alignItems:'center'}}>
        <Button
          color="#fc6500"
          loading={isLoading}
          style={{width: 250, marginBottom: 10}}
          mode="contained"
          onPress={() => onRegister()}>
          Realizar cadastro
        </Button>
      </Box>

      <Snackbar
        visible={visibleSnack}
        style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#f64a4a'}}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Sair',
          onPress: () => { onDismissSnackBar() }
        }}>
          <Text style={{color:'#fff', textAlign: 'center'}}>
          {messageSnack}
          </Text>
      </Snackbar>

    </Body>
    </ScrollView>
    </Surface>

  );
}
