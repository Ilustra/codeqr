import React, {Component, useState, useEffect} from 'react';

import {View, Text, Alert, StyleSheet} from 'react-native';
import {Snackbar,  ProgressBar, FAB, Portal, Dialog, TextInput, Button} from 'react-native-paper';
import {RNCamera} from 'react-native-camera';
import {
  Body,
  Container,
  List,
  BoxInfo,
  Submit,
  BoxScanLeft,
  BoxScanRigth,
  BoxScanTop,
  BoxScanBotton,
  BOXSCANN,
  BoxTexte,
  BoxRow,
  Box,
  BarLefthTop,
  BarLefthBotton,
  BarTopLefth,
  BarBottonLefth,
  BarTopRigth,
  BarBottonRigth,
  BarRithTop,
  BarRithBotton,

} from './style';

import { InterstitialAd, AdEventType, BannerAd, BannerAdSize } from '@react-native-firebase/admob';
//
import {ExpErr} from '../expecptions'
//importar o serviço do realm para poder salvar
import getRealm from '../../services/realm';

import { RegisterNota } from '../../Controller/ControllerNotas';

import {IDintersiial} from '../variaveis'
import {IDBanner} from '../variaveis'
const adUnitId = IDintersiial;
const BannerId = IDBanner;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});
import QRCodeScanner from 'react-native-qrcode-scanner';
export default function Camera({navigation}) {
  const onStateChange = () => setOpen(!open);
  const [qrCode, setQrCode] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [chaveAcess, setChaveAcess] = useState();

  const [isVisibleProgress, setVisibleProgress] = useState(false);

  const onDismissProgress=()=>setVisibleProgress(false);
      //snack
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('');
  const [styleSnack, setStyleSnack] = useState(false)
  const onDismissSnackBar = () => setVisibleSnack(false);

  const [isDialogManual, setIsDialogManual] = useState(false)
  const hideDialogManual = () => { setIsDialogManual(false) }

  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }
  
  useEffect(() => {

    }, []);
      
    function buscarChave(chave){

      console.log(chave);
    }
  return (
    <Body>
      <Container>
        <BoxInfo>
          <Text style={{fontSize: 20, textAlign: 'center', color: '#646464'}}>
            Scaneie o codigo QR
          </Text>
          <Text style={{fontSize: 20, textAlign: 'center', color: '#646464'}}>
            de sua nota fiscal eletronica para obter produtos e valores
          </Text>
          <ProgressBar visible={isVisibleProgress} indeterminate={true}  progress={0.5}  />
        </BoxInfo>
        <CMmera />
        <BoxTexte>
          <BoxScanTop />

          <BoxRow>
            <BoxScanLeft />

            <Box>
              <BarLefthTop />
              <BarLefthBotton />
            </Box>
            <Box>
              <BarTopLefth />
              <BarBottonLefth />
            </Box>

            <BOXSCANN />

            <Box>
              <BarTopRigth />
              <BarBottonRigth />
            </Box>

            <Box>
              <BarRithTop />
              <BarRithBotton />
            </Box>

            <BoxScanRigth />
          </BoxRow>

          <BoxScanBotton />

        </BoxTexte>
        <BoxInfo>
          <Text style={{fontSize: 14, textAlign: 'center', color:'#00C441'}}>
            Mantenha a câmera parada fixada sobre o código qr.
          </Text>
      
        </BoxInfo>
      </Container>
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
    </Body>
  );
 
  function CMmera() {
    async function handledAddRepository(data) {
      
        setVisibleProgress(true)
        const realm = await getRealm();
        const _user = realm.objects('User');
        const id = _user[0]._id
       await RegisterNota(data, id)
       .then(r=>{
        setQrCode(null)
        onDismissProgress()
        interstitial.load()
        interstitial.onAdEvent(type=>{
          console.log('type', type)
          if(type === AdEventType.LOADED){
              interstitial.show();
          }
          if(type ===AdEventType.CLOSED){
            LOADED = false
            onSnack(true, 'Nota registrada com sucesso', true)
          }
        })
      })
       .catch(e=>{
        setQrCode(null)
         const {response} = e
         onSnack(true, ExpErr(response.status, response.data), false)
         //onDismissProgress()
       });
       
    }


    async function barcodeRecognized({barcodes}) {
      console.log(barcodes)
     /* const string = 'http://www.fazenda.pr.gov.br/';
      const lastString = barcodes[0].data.substring(0, string.length);
      if (!qrCode) {
        if (string == lastString) {
          setQrCode(barcodes);
          await handledAddRepository(barcodes[0].data);
        }
      }*/
    }

    async function onSuccess (e){
      
      navigation.navigate("Process", {url: e.data});
   //  await handledAddRepository(e.data);
    };

    return (
      <>
      <QRCodeScanner
        onRead={onSuccess}
        flashMode={RNCamera.Constants.FlashMode.auto}
      />
      </>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
