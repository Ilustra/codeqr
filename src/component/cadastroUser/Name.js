import React, { useState } from 'react';

import { Button, TextInput, Snackbar, Surface,Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, View, Text } from 'react-native'
//

export default function Name({ navigation: { navigate } }) {
    const [name, setName] = useState('')
    function onNext(string){
        navigate('Email', {
            id: 1,
            name: string
        })
    }
    return (
        
        <Surface style={{ flex: 1, backgroundColor: '#fc6500' }}>
           
                <View style={{ flexDirection: "column", flex: 1, justifyContent:'space-between', padding: 10 }}>
                    <View ></View>
               
                         <Text style={{ fontSize: 22, textAlign: 'center' }}>Digite seu nome</Text>
                        <TextInput
                            label="Nome"
                            style={{
                                backgroundColor: '#fc6500',
                                fontSize: 28,
                                color:'#fff'
                            }}
                            color='#fff'
                            value={name}
                            onChangeText={setName}
                        />
                        <Button color='#fff' onPress={()=>{onNext(name)}}>continuar</Button>
                  
                <View></View>
                </View>
            
        </Surface>

    );
}
