import React, { useState, useEffect, useMemo } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import AuthContext from './context/auth'

import Dashbard from './component/dashboard';
import HomeScreen from './component/home';
import MonthBalance from './component/MonthBalance';
import Notas from './component/notas';
import Lista from './component/Lista';
import Name from './component/cadastroUser/Name';
import Password from './component/cadastroUser/Password';
import Email from './component/cadastroUser/Email';
import DetalheNota from './component/view/DetalheNota';
import SerachProducts from './component/srarch_products';
import Perfil from './component/user/perfil';
import Login from './component/login';
import ViewLista from './component/viewLista';
import ReportMeta from './component/report-meta';
import Camera from './component/camera';
import Despensa from './component/Despensa';
import DespensaView from './component/DespensaView';
import Lancamento from './component/lancamento';
import getRealm from './services/realm';

//firebase 
import auth from '@react-native-firebase/auth';
import {checkAuth} from './Controller/ControllerAuthenticate'

export default function Routes() {
  const RootStack = createStackNavigator();

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        const { token } = data;
        dispatch({ type: 'SIGN_IN', token: token });
      },
      signOut: async () => {
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async data => {
        const { token } = data
        dispatch({ type: 'SIGN_IN', token: token });
      },
    }),
    [],
  );

  
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
    { isLoading: true, isSignout: false, userToken: null },
  );
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const Realm = await getRealm();
        const _user = Realm.objects('User');
        // Prompt the user to re-provide their sign-in credentials
        dispatch({ type: 'RESTORE_TOKEN', token: _user[0].token });  
        if(_user.length){
          await checkAuth()
          .then(r=> {
          dispatch({ type: 'RESTORE_TOKEN', token: _user[0].token });            
          })
          .catch(e=>{
            const {response} = e
        //   dispatch({ type: 'SIGN_OUT' });
          })
        }else{
          dispatch({ type: 'SIGN_OUT' });
        }
      } catch (e) {
        console.log('error singInwithCreential', e)
        //dispatch({ type: 'SIGN_OUT' });
      }
    };
    bootstrapAsync();
  }, []);

  

  return (
    <>
      <AuthContext.Provider value={authContext}>
        <RootStack.Navigator mode="modal">
          {state.userToken == null ? (
            <>
            <RootStack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <RootStack.Screen
            name="Name"
            component={Name}
            options={{
              headerShown: false 
            }}
          />            
          <RootStack.Screen
            name="Email"
            component={Email}
            options={{
              headerShown: false 
            }}
          />          
          <RootStack.Screen
            name="Password"
            component={Password}
            options={{
              headerShown: false 
            }}
          />
          </>
          ) : (
            <>
              <RootStack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                headerShown: false 
              }}
        
            />        
              <RootStack.Screen
              name="Dashbard"
              component={Dashbard}
              options={{
                headerShown: false,
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#fc6500',
                },
              }}
            />
            <RootStack.Screen
              name="Listas"
              component={Lista}
            />
              <RootStack.Screen
              name="Notas"
              component={Notas}
            />
            <RootStack.Screen
              name="SerachProducts"
              component={SerachProducts}
              options={{
                headerShown: false,
                title:'Produtos'
              }}
            />  
            <RootStack.Screen
              name="ViewLista"
              component={ViewLista}
              options={
                {
                  headerShown: false,
                  title: 'Lista',
                }
                
            }
            />      

            <RootStack.Screen
              name="DetalheNota"
              options={{ headerShown: false }}
              component={DetalheNota}
            />          
            <RootStack.Screen
              name="Lancamento"
              options={{ headerShown: false }}
              component={Lancamento}
            /> 
             <RootStack.Screen
              name="MonthBalance"
              options={{ headerShown: false }}
              component={MonthBalance}
            />                 
             <RootStack.Screen
              name="Relatorio"
              component={ReportMeta}
            />                
            <RootStack.Screen
              name="Camera"
              options={{ headerShown: false }}
              component={Camera}
            />            
            <RootStack.Screen
              name="Despensa"
              options={{ headerShown: false }}
              component={Despensa}
            />           
             <RootStack.Screen
              name="DespensaView"
              options={{ headerShown: false }}
              component={DespensaView}
            />
            <RootStack.Screen
              name="Perfil"
              options={{
                title: 'Editar perfil',
                headerShown: state.userToken ? true: false,
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#fc6500',
                },
              }}
              component={Perfil}
            />

            </>
            )}


        </RootStack.Navigator>
      </AuthContext.Provider>
    </>
  );
}
