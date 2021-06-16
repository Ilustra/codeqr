import React, {useState, useEffect, useMemo} from 'react';
import {Button, TextInput} from 'react-native-paper';
//
import AwesomeAlert from 'react-native-awesome-alerts';
import {useNavigation} from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {StatusBar, Image, StyleSheet, Text, View} from 'react-native';
import {
  Container,
  Input,
  Body,
  Label,
  Box,
  BoxSubmit,
  Submit,
  BoxLogo,
} from './component/login/style';
//
import HomeScreen from './component/home';
import Despensa from './component/Despensa';
import Lista from './component/Lista';
import CadastroUser from './component/cadastroUser';
import Meta from './component/Meta';
import DetalheNota from './component/view/DetalheNota';
import ScannNotas from './component/ScannNotas';
import ShareUser from './component/user/ShareUser';
import Perfil from './component/user/perfil';
import Notification from './component/Notification';
import Login from './component/Login';

//controller
import {Authenticate} from './Controller/ControllerAuthenticate';
//repositorys
import {createUser} from './saveRepository/RepositoryUser';
//realm
import getRealm from './services/realm';
//
export const AuthContext = React.createContext();
//

export default function Routes() {
  const RootStack = createStackNavigator();
  //

  const [isLoading, setIsLoading] = useState(false);
  //
  const [user, setUser] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  const [progress, setProgress] = useState(false);
  const [titleMessage, setTitleMessage] = useState('ops! algo deu errado!');

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {isLoading: true, isSignout: false, userToken: null},
  );
  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        const Realm = await getRealm();
        const user = Realm.objects('User');
        if (user.length > 0) {
          userToken = user[0].token;
          setUser(user[0].nome);
          setToken(userToken);
        }
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      } catch (e) {
        dispatch({type: 'SIGN_OUT'});
      }
    };
    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        setIsLoading(true);
        const {email, password} = data;
        try {
          const responseUser = await Authenticate(email, password);

          if (responseUser.error) {
            setIsLoading(false);
            setError(true);
            setMessage(responseUser.error);
          } else {
            setError(false);

            await createUser(responseUser, password);
            dispatch({type: 'SIGN_IN', token: responseUser.token});
          }
        } catch (e) {
          setError(true);
          setMessage('Ops! algo deu errado, tente novamente mais tarde!!!');
        }
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: 'userToken'});
      },
    }),
    [],
  );

  function MessageLoading({data}) {
    setTimeout(() => {
      setMessage('');
      setError(false);
      setIsLoading(false);
    }, 2000);
    return (
      <View style={{margin: 0}}>
        <Text style={{color: '#f64a4a', textAlign: 'center'}}>{message}</Text>
      </View>
    );
  }
  function Login({navigation: {navigate}}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {signIn} = React.useContext(AuthContext);

    return (
      <Body>
        <Container>
          <Box>
            <BoxLogo>
              <Image
                style={{width: 160, height: 120, alignItems: 'center'}}
                source={require('../src/image/dispensa.png')}
              />
            </BoxLogo>
            <Box>
              <TextInput
                label="Email"
                style={{backgroundColor: '#fff', borderColor: '#c7c7c7'}}
                mode="outlined"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </Box>
            <Box>
              <TextInput
                style={{backgroundColor: '#fff', borderColor: '#fafafa'}}
                label="Senha"
                mode="outlined"
                keyboardType="numeric"
                value={password}
                onChangeText={setPassword}
              />
            </Box>
            <MessageLoading data={message} />
            <Box style={{marginTop: 20}}>
              <Button
                color="#000"
                icon="send"
                loading={isLoading}
                mode="contained"
                onPress={() => signIn({email, password})}>
                Entrar
              </Button>
              <Button
                color="#000"
                style={{marginTop: 20}}
                mode="outlined"
                onPress={() => navigate('CadastroUser')}>
                Cadastre-se
              </Button>
            </Box>
          </Box>
        </Container>
      </Body>
    );
  }
  function BtnShareuser() {
    const navigation = useNavigation();
    return (
      <Submit
        onPress={() => navigation.navigate('ShareUser')}
        style={{width: 60}}>
        <Icon name="group" size={30} color="#fff" title="Produtos" />
        <Text
          style={{
            fontSize: 9,
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Pessoas
        </Text>
      </Submit>
    );
  }
  return (
    <>
      <StatusBar
        backgroundColor="#fc6500"
        translucent
        barStyle="light-content"
      />
      <AuthContext.Provider value={authContext}>
        <RootStack.Navigator mode="modal">
          {state.userToken == null ? (
            <>
              <RootStack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
              />
              <RootStack.Screen
                name="CadastroUser"
                component={CadastroUser}
                options={{
                  title: 'Cadastro',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
              />
            </>
          ) : (
            <>
              <RootStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                  title: `Olá, ${user}`,
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
              />
              <RootStack.Screen
                name="Despensa"
                options={{
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  headerRight: () => <BtnShareuser />,
                  /*headerRight: ({navigation: {navigate}}) => (
                    <Submit
                      onPress={() => navigate('Share')}
                      style={{width: 60}}>
                      <Icon
                        name="group"
                        size={30}
                        color="#fff"
                        title="Produtos"
                      />
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: 'bold',
                          color: '#fff',
                        }}>
                        Pessoas
                      </Text>
                    </Submit>
                  ),*/
                }}
                component={Despensa}
              />
              <RootStack.Screen
                name="Lista"
                component={Lista}
                options={{
                  title: 'Lista',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
              />
              <RootStack.Screen name="Meta" component={Meta} />
              <RootStack.Screen
                name="ShareUser"
                options={{
                  headerShown: false,
                  title: 'Usuários',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
                component={ShareUser}
              />
              <RootStack.Screen
                name="ScannNotas"
                component={ScannNotas}
                options={{
                  title: 'Notas escaneadas',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
              />
              <RootStack.Screen
                name="DetalheNota"
                options={{headerShown: false}}
                component={DetalheNota}
              />
              <RootStack.Screen
                name="Perfil"
                options={{
                  title: 'Editar perfil',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
                component={Perfil}
              />
              <RootStack.Screen
                name="Notification"
                component={Notification}
                options={{
                  title: 'Notificações',
                  headerTintColor: '#fff',
                  headerStyle: {
                    backgroundColor: '#fc6500',
                  },
                  //headerRight: () => <InfoCart />,
                }}
              />
            </>
          )}
        </RootStack.Navigator>
      </AuthContext.Provider>
    </>
  );
}
