import React, {Component, useEffect} from 'react';

import {StatusBar, View, Text} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {ExpErr} from '../expecptions'
import { Surface, Button, IconButton, Title, Divider, Subheading,ActivityIndicator,Snackbar } from 'react-native-paper';
import { useState } from 'react/cjs/react.development';
import { RegisterNota } from '../../Controller/ControllerNotas';
//importar o serviço do realm para poder salvar
import getRealm from '../../services/realm';
import { formatarMoeda } from '../bibliotecas_functions'
import { InterstitialAd, AdEventType, BannerAd, BannerAdSize } from '@react-native-firebase/admob';
//
import {IDintersiial} from '../variaveis'
import {IDBanner} from '../variaveis'
const adUnitId = IDintersiial;
const BannerId = IDBanner;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

export default function Process({route, navigation}) {
  const [nota, setNota] = useState()
  const [animating, setAnimating] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('processando nota')
  const [headeMessage, setHeaderMessage] = useState('um anuncio tela interia será exibido e sua nota será registrada')
 
       //snack
       const [visibleSnack, setVisibleSnack] = useState(false);
       const [messageSnack, setMessageSnack] = useState('');
       const [styleSnack, setStyleSnack] = useState(false)
       const onDismissSnackBar = () => setVisibleSnack(false);

  useEffect(() => {
    const url = route.params
    console.log(url)
    setAnimating(true);
    setTitle('Aguarde...')
    t(url.url);
    
  }, []);
  async function t (url){
    const realm = await getRealm();
    const _user = realm.objects('User');
    const id = _user[0]._id
    await RegisterNota(url, id)
    .then(r=>{
     setTitle('Processando, aguarde o anúncio para o registro da nota!')
     setTimeout(() => {
    interstitial.load()
    interstitial.onAdEvent(type=>{
       if(type === AdEventType.LOADED){
           interstitial.show();
       }
       if(type ===AdEventType.CLOSED){
        setAnimating(false);
        setNota(r.data)
         setTitle('Nota registrada com sucesso')
       }
     })
     }, 1200);
   })
    .catch(e=>{
      setAnimating(false);
      const {response} = e
      onSnack(true, ExpErr(response.status, response.data), false)
      setTitle(ExpErr(response.status, response.data))
    });
  }
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }

    return(
        <Surface style={{flex:1, alignItems:'center', justifyContent:'space-between', flexDirection:'column'}}>
          <View></View>
          {nota ?
          <View>
            <Text style={{fontSize: 22, textAlign:'center'}}>{nota.nome}</Text>
            <Text style={{fontSize: 22, textAlign:'center', fontWeight:'bold'}}>R$ {nota.total}</Text>

          </View> : null}
          <ActivityIndicator animating={animating} />

          <Text style={{fontSize:22, textAlign:'center', margin: 10}}>{title}</Text>
          {!animating ? 
                 <View>
                 <Button mode='outlined' onPress={()=> navigation.navigate('HomeScreen')}>Voltar ao Home</Button>
                 <Button mode='outlined' onPress={()=> navigation.navigate('Camera')}>Escanear outra nota</Button>
               </View>:
               null}
   
          <View></View>
         <Snackbar
        visible={visibleSnack}
        style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#fcc7c7c7' }}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Sair',
          onPress: () => { onDismissSnackBar() }
        }}>
        {messageSnack}
      </Snackbar>
      <BannerAd
      unitId={BannerId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
        </Surface>
    )
}