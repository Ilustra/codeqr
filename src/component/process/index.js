import React, {useEffect, useState} from 'react';

import {View, Text} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { Surface, Button,  ActivityIndicator,Snackbar } from 'react-native-paper';

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
import {ExpErr} from '../expecptions'
export default function Process({route, navigation}) {
  const {url} = route.params
  const [nota, setNota] = useState()
  const [animating, setAnimating] = useState(false)
  const [title, setTitle] = useState('')

   //snack
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('');
  const [styleSnack, setStyleSnack] = useState(false)
  const onDismissSnackBar = () => setVisibleSnack(false);

  useEffect(() => {
    async function handledAddRepository(data) {
      setAnimating(true)
      const realm = await getRealm();
      const _user = realm.objects('User');
      const id = _user[0]._id
     await RegisterNota(data, id)
     .then(r=>{
      setNota(r.data);
      interstitial.load()
      interstitial.onAdEvent(type=>{

        if(type === AdEventType.LOADED){
            interstitial.show();
        }
        if(type ===AdEventType.CLOSED){

          setAnimating(false)
          onSnack(true, 'Nota registrada com sucesso', true);
          setTitle('Nota registrada com sucesso');
        }
        if(type=== 'error'){
          setAnimating(false)
          setTitle('Nota registrada com sucesso');
          onSnack(true, 'Nota registrada com sucesso', true)
        }
      })
    })
     .catch(e=>{

       const {response} = e
       onSnack(true, ExpErr(response.status, response.data), false)
       setAnimating(false)
       setTitle(ExpErr(response.status, response.data))
       //onDismissProgress()
     });
     
  }
  handledAddRepository(url)
  }, []);

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
                 <Button mode='outlined' onPress={()=> navigation.navigate('HomeScreen')}>Voltar ao inicio</Button>

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
 
    <View style={{justifyContent:'center', alignItems:'center', marginTop: -100, marginBottom: 100}}>
    <BannerAd
    unitId={BannerId}
    size={BannerAdSize.MEDIUM_RECTANGLE}
    requestOptions={{
      requestNonPersonalizedAdsOnly: true,
    }}
  />
    </View>

    
        </Surface>
    )
}