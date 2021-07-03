import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, Animated, View, Image, Linking } from 'react-native';
import { Surface, Button, Portal, IconButton, Dialog, Provider, Snackbar, Avatar, Title, ActivityIndicator, Menu, 
    Divider, Card, List, FAB, Subheading } from 'react-native-paper';
import {Submit, ListFlat} from './style'
import { useState } from 'react/cjs/react.development';
import {formatarMoeda} from '../bibliotecas_functions'
export default function Lancamento() {
    const [valor, setValor] = useState(0)
    const [numeric, setNumeric] = useState([1,2,3,4,5,6,7,8,9]);

    function calc(value){
        console.log(valor)
        if(valor!=0)
         setValor(""+valor+value)
         else
         setValor(value);

    }
    
    function onDelete(){
        setValor(0);
    }
    function ItemNum({data}){
        return(
        <Submit onPress={()=> calc(data)} style={{width: 90, height: 90, backgroundColor: '#c7c7c7', borderRadius: 10, alignItems:'center',  justifyContent:'center', margin:5}}>
            <Text style={{fontSize: 32, fontWeight:'bold'}}>{data}</Text>
        </Submit>
        )
    }
  return (
    <Surface style={{flex: 1, alignItems:'center'}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Submit  style={{padding: 5, margin: 5}}>
                <Text>Receita</Text>
            </Submit>            
            <Submit style={{padding: 5, margin: 5}}>
                <Text>Despesa</Text>
            </Submit>
        </View>
    <View>
        <Text style={{fontWeight:'bold', fontSize: 42}}>R$ {formatarMoeda(valor)}</Text>
    </View>
    <View style={{width: '80%'}}>
    <ListFlat
            numColumns={3}
            data={numeric}
            keyExtractor={index => String(index)}
            renderItem={({ item }) => <ItemNum data={item} />}
          />
          <View style={{flexDirection:'row'}}>
          <Submit onPress={()=> onDelete()} style={{width: 90, height: 90, backgroundColor: '#c7c7c7', borderRadius: 10, alignItems:'center',  justifyContent:'center', margin:5}}>
            <Text style={{fontSize: 32, fontWeight:'bold'}}>Del</Text>
        </Submit>  
         <Submit onPress={()=> calc(0)} style={{width: 90, height: 90, backgroundColor: '#c7c7c7', borderRadius: 10, alignItems:'center',  justifyContent:'center', margin:5}}>
            <Text style={{fontSize: 32, fontWeight:'bold'}}>0</Text>
        </Submit>   
         <Submit onPress={()=> calc('.')} style={{width: 90, height: 90, backgroundColor: '#c7c7c7', borderRadius: 10, alignItems:'center',  justifyContent:'center', margin:5}}>
            <Text style={{fontSize: 32, fontWeight:'bold'}}>,</Text>
        </Submit>   

          </View>

    </View>
    <View style={{flexDirection: 'row'}}>
    <Surface style={{elevation: 2, height: 100, width: 100, borderRadius: 10, margin: 5,}}>

    </Surface>    
    <Surface style={{elevation: 2, height: 100, width: 100, borderRadius: 10, margin: 5}}>

    </Surface>
    </View>

    </Surface>
  );
}
