import React, {Component, useState, useEffect} from 'react';

import {View, Text, Alert, StyleSheet} from 'react-native';
import {Snackbar,  ProgressBar, Colors} from 'react-native-paper';
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

export default function Camera({navigation: {navigate}}) {
  
  const [qrCode, setQrCode] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [isVisibleProgress, setVisibleProgress] = useState(false);

  const onDismissProgress=()=>setVisibleProgress(false);
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
  
  useEffect(() => {

    }, []);
      

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
      const string = 'http://www.fazenda.pr.gov.br/';
      const lastString = barcodes[0].data.substring(0, string.length);
      if (!qrCode) {
        if (string == lastString) {
          setQrCode(barcodes);
          await handledAddRepository(barcodes[0].data);
        }
      }
    }
    return (
      <>
        <RNCamera
          style={styles.preview}
          onGoogleVisionBarcodesDetected={barcodeRecognized}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={RNCamera.Constants.FlashMode.off}
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
