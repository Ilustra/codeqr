import React, { useState, useMemo, useEffect } from 'react';
import { Button, TextInput, Snackbar,Title, Dialog, Portal, Surface, ActivityIndicator, Colors, RadioButton } from 'react-native-paper';
//
import { Image, View, Text, StatusBar,  } from 'react-native';

import { ExpErr } from '../expecptions'
import { ScrollView } from 'react-native-gesture-handler';
import {sendReport} from '../../Controller/controller-report'

export default function ReportOccurrences({ navigator }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [note, setNote] = useState("");
    const [checked, setChecked] = useState('first');
    const [isLoading, setIsloading] = useState(false)
    const onDimissLoading =()=>{setIsloading(false)}
          //snack
          const [visibleSnack, setVisibleSnack] = useState(false);
          const [messageSnack, setMessageSnack] = useState('');
          const [styleSnack, setStyleSnack] = useState(false)
          const onDismissSnackBar = () => setVisibleSnack(false);
      
          function onSnack(status, message, style) {
    
            setVisibleSnack(status);
            setMessageSnack(message)
            setStyleSnack(style)
          }
          //

    async function send(title, description, note){
       
        if(title!="" && description!=""){
            setIsloading(true)
            await sendReport(title, description,note).then(r=>{
                onDimissLoading()
                onSnack(true, 'Sua menssagem foi enviada e ficamos muito feliz por sua ajuda!!', true) 
            })
            .catch(e=>{
                onDimissLoading()
                onSnack(true, ExpErr(e.status, e.data), false) 
            })
        }else{
            onSnack(true, 'Ops! Os campos com * na frente devem ser preenchidos', false) 
        }
    }

    return (
        <Surface style={{ flex: 1}}>
            <ScrollView>
                <Surface style={{backgroundColor:'#fff', padding: 10, elevation:1, marginBottom: 5}}>
                <Text style={{textAlign:'center', fontSize: 16, color:'#505050'}}>Área reservada para relatar mau funcioanmento, sugestões e elogios, 
                qualquer relato será de grande ajuda.
                </Text>
                </Surface>
                <View style={{flex: 2,backgroundColor: '#fff', margin: 10, padding: 10, borderRadius: 5, elevation: 1}}>
                    <Title style={{margin: 10}}>Formulário</Title>
                    <TextInput
                        label="Titulo*"
                        color='#fff'
                        placeholder='ex: scann notas'
                        value={title}
                        onChangeText={setTitle}
                    /> 
                    <Text style={{color:'#909090'}}>preferencialmente colocar o nome da tela que estava usando</Text>                  
                     <TextInput
               
                        style={{marginTop: 10}}
                        label="Descrição*"
                        multiline={true}
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Text style={{color:'#909090'}}>Descrever o que ocorreu quando usou</Text>
                    <TextInput
                        style={{marginTop: 10, height: 120}}
                        mode='outolined'
                        color='#fff'
                        multiline={true}
                        label="Observações"
                        value={note}
                        onChangeText={setNote}
                    />
                    <Text style={{color:'#909090'}}>aberto para você descrever qualquer relato </Text>
                    <Button loading={isLoading} color='#000' style={{marginTop: 10}} mode='contained' name='send' onPress={()=>send(title, description, note)}>Enviar</Button>
                </View>
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
            </ScrollView>
        </Surface>
    )
}