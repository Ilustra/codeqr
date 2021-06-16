import React, {Component, useEffect} from 'react';
import {ListF} from './style';
import {StatusBar, View, Text} from 'react-native';
import {Container, Body} from './style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Produtos from './Repository';
import { Surface, Button, IconButton, Title, Divider, Subheading } from 'react-native-paper';
import {stringDate} from '../../bibliotecas_functions'
//

import { InterstitialAd, AdEventType } from '@react-native-firebase/admob';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import {IDBanner, IDintersiial} from '../../variaveis'
const adUnitId = IDBanner;

const interstitial = InterstitialAd.createForAdRequest(IDintersiial, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

export default function DetalheNota({route, navigation}) {
  const {data} = route.params;


  useEffect(() => {
    interstitial.load()
    interstitial.onAdEvent(type => {
   
      if (type === AdEventType.LOADED) {
        setTimeout(() => {
          interstitial.show();
        }, 2500);
      }
      if (type === AdEventType.CLOSED) {
  
        LOADED = false
  
      }
    })
  }, []);

  return (
    <>
      <Container style={{backgroundColor:'#fff'}}>
        <Text style={{textAlign:'center', fontWeight:'bold', fontSize: 16}}>{data.nome}</Text>
        <Text style={{textAlign:'center', fontSize: 14}}>CNPJ: {data.cnpj}</Text>
        <Text style={{textAlign:'center'}}>{data.localidade } {data.uf} </Text>
        <Text style={{textAlign:'center'}}>Endereço: {data.rua} nº{data.numero}, {data.bairro} </Text>


      <Divider/>
      <Surface style={{padding: 5, flex: 1, borderRadius: 5, margin: 5, elevation: 2, backgroundColor:'#fff'}}>
        <ListF
          data={data.produtos}
          keyExtractor={item => item._id}
          renderItem={({item}) => <Produtos data={item} />}
        />
        </Surface>
        <Divider/>
        <View style={{padding: 10}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Subtotal</Text>
          <Text>R$ {data.subTotal}</Text>
        </View>        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>descontos</Text>
          <Text>R$ {data.descontos}</Text>
        </View>        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Total</Text>
          <Text>R$ {data.total}</Text>
        </View>        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Tributos</Text>
          <Text>R$ {data.tributos}</Text>
        </View>
        <Text style={{textAlign:'center', fontWeight: 'bold'}}>{stringDate(data.emissao)} </Text>
        </View>
     
      </Container>
      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
    </>
  );
}
