import React, {useState} from 'react';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {Animated} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
//
import {View, Text, Alert} from 'react-native';
import {Container, Body, BoxSubmit, BoxRow, Box} from './style';
//
import MessageError from '../MessageError';
import getRealm from '../../services/realm';
//
import {
  BoxMessage,
  BoxFlex,
  TabText,
  SubmitMessage,
} from '../MessageError/style';
import {createUser} from '../../Controller/ControllerUser';

export default function CadastroUser({navigation: {navigate}}) {
  //
  const [nome, setNome] = useState(null);
  const [email, setEmail] = useState(null);
  const [lengthHeight, setlengthHeight] = useState(50);
  const [password, setPassword] = useState('');
  const [confirPassword, setConfirmPassword] = useState('');
  //
  const [messageSucess, setMessageSucess] = useState(false);
  const [errorPassword, setErrorPassowrd] = useState(false);
  const [messageError, setMessageError] = useState(false);
  const [error, setError] = useState('');
  const [errorEmail, setErrorEmail] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewPassword, setViewPassword] = useState(true);
  //
  async function onCreate() {
    let isValid = false;
    const data = {
      nome,
      email,
      cpf,
      telefone,
      DDD,
      cep,
      password,
    };
    //

    setIsloading(true);

    isValid = validateEmail(email);
    isValid = validadePassword(password, confirPassword);
    isValid = validadeForm();
    //
    if (isValid) {
      try {
        const user = await createUser(data);
        if (user.error) {
          setError(true);
          setMessageError(user.error);
        } else {
          const data = {
            _id: user._id,
            nome: user.nome,
            email: user.email,
            password: password,
            token: user.token,
            despensa: user.despensa[0].id,
          };
          const realm = await getRealm();
          realm.write(() => {
            realm.create('User', data, 'modified');
          });
          setMessageSucess('Prabéns, cadastro realizado com sucesso!!!');
        }
      } catch (e) {
        setIsloading(true);
        setError(true);
        setMessageError('Ops! algo inesperado aconteceu!!');
      }
      //
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
    return (
      <Box style={{marginTop: 5}}>
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
    <Body>
      <Container>
        <BoxRow
          style={{
            borderBottomWidth: 1,
            borderColor: '#c7c7c7',
            width: 150,
            marginTop: 20,
            marginBottom: 5,
          }}>
          <Icon name="assignment-ind" size={20} color="#909090" />
          <Text style={{color: '#909090', marginLeft: 5, fontSize: 16}}>
            Digite seu nome
          </Text>
        </BoxRow>
        <TextInput
          label="Nome"
          style={{
            backgroundColor: '#fff',
            height: lengthHeight,
            borderColor: '#c7c7c7',
          }}
          mode="outlined"
          value={nome}
          onChangeText={setNome}
        />

        <BoxRow
          style={{
            borderBottomWidth: 1,
            borderColor: '#c7c7c7',
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
            height: lengthHeight,
            borderColor: '#c7c7c7',
          }}
          mode="outlined"
          error={errorEmail}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <BoxRow
          style={{
            borderBottomWidth: 1,
            borderColor: '#c7c7c7',
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
                borderColor: '#c7c7c7',
                height: lengthHeight,
              }}
              mode="outlined"
              placeholder=" informe uma senha"
              keyboardType="numeric"
              value={password}
              secureTextEntry={viewPassword}
              error={errorPassword}
              onChangeText={setPassword}
            />
            <TextInput
              label="Confirme sua senha"
              style={{
                backgroundColor: '#fff',
                borderColor: '#c7c7c7',
                height: lengthHeight,
              }}
              mode="outlined"
              placeholder="repita a senha informada a cima"
              keyboardType="numeric"
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
      </Container>

      <Box style={{marginTop: 10}}>
        <Button
          color="#000000"
          loading={isLoading}
          style={{marginTop: 20, borderRadius: 0}}
          mode="contained"
          onPress={() => onCreate()}>
          Realizar cadastro
        </Button>
      </Box>
    </Body>
  );
}
