import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { FAB, Portal, Subheading, Surface, TextInput, Button, Dialog, Title, Snackbar, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
export default function AlertNoRegister({ navigation }) {
    const [isVisible, setVisible]= useState(true)
  useEffect(() => {
    async function getLista() {

    }
    getLista();
  }, []);
  function Navigate(string){

      navigation.navigate(string)
      setVisible(!isVisible)
  }
  return (

            <Dialog style={{flex: 1}} visible={isVisible}>
              <Dialog.Content style={{flex: 1, alignItems: 'center'}}>
                    <Image
            style={{ width: 160, height: 120, alignItems: 'center', justifyContent:'center'}}
            source={require('../../image/despensa.png')}
          />

                    <Surface style={{flex: 2, justifyContent:'center'}}>
                    <Title style={{textAlign:'center', marginBottom: 30, marginTop: -30}}>Você precisa estár logado para ter acesso total</Title>  
                        <Button mode='contained' onPress={()=> Navigate("Login")}>
                            Login
                        </Button>
                        <Button mode='outlined' style={{marginTop: 20}} onPress={()=> Navigate('CadastroUser')}>
                            Cadastre-se
                        </Button>                        
                        

                    </Surface>
                    <Button icon='home' onPress={()=> navigation.navigate('Home')}>
                            Voltar para o inicio
                        </Button>
              </Dialog.Content>
            </Dialog>

  );
}
