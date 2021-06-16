import React, { useState } from 'react';

import { Button, TextInput, Snackbar, Surface, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, View, Text } from 'react-native'
//

export default function Email({ navigation, route }) {
  const [email, setEmail] = useState('')
  const {id, name} = route.params  
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

    function onNext(string){
      console.log('lsls')
        const isValid = validateEmail(string);
        if(isValid){
            navigation.navigate('Password', {
                id: 2,
                name: name,
                email: string
            })
        }else{
            onSnack(true, 'formato de e-mail inválido!!')
        }

    }

    function validateEmail(text) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
        if (reg.test(text) === false) {

          return false;
        } else {
    
          return true;
        }
      }
    
    return (
        
        <Surface style={{ flex: 1, backgroundColor: '#fc6500' }}>
           
                <View style={{ flexDirection: "column", flex: 1, justifyContent:'space-between', padding: 10 }}>
                    <View ></View>
                      
                        <Text style={{ fontSize: 22, textAlign: 'center' }}>Digite seu e-mail</Text>
                        <TextInput
                            label="e-mail"
                            style={{
                                backgroundColor: '#fc6500',
                                fontSize:28
                            }}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Button color='#fff' onPress={()=>{onNext(email)}}>continuar</Button>
                  
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
