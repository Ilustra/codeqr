import React, { useEffect, useState } from 'react';
import { Surface, Button, Portal, IconButton, Dialog, Provider, Snackbar, Avatar, Title, ActivityIndicator, Menu, Colors, Divider, Card, List, FAB, Subheading } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Text, Animated, View, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ExpErr } from '../expecptions'
import getRealm from '../../services/realm';
import AuthContext from '../../context/auth'

//style
import {
  BoxRow,
  Submit,
  ListF,
  ViewCard, Body
} from './style';
//componenentes
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

import { stringDate } from '../bibliotecas_functions'

import { getNotas, onDelete } from '../../Controller/ControllerNotas';
import MenssagemLength from '../MenssagemLength'
import { InterstitialAd, AdEventType, TestIds } from '@react-native-firebase/admob';
import { IDintersiial } from '../variaveis'
import UserAuth from '../../business/auth'
import TabsBox from '../TabsBox'
import Grap from '../Grap'
const adUnitId = IDintersiial;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

export default function Dashbard({ navigation }) {

  //menu
  const [visible, setVisible] = useState(false);
  const [itemMenu, setItemMenu] = useState();
  const [positionMenu, setPositionMenu] = useState({ x: 150, y:150});
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [expanded, setExpanded] = React.useState(true);
  //
  const handlePress = () => setExpanded(!expanded);
  const [objUser, setObjUser] = useState();
  const [user, setUser] = useState();
  const [avatarImage, setIvatarImage] = useState()
  const [nota, setNota] = useState([]);
  const [open, setOpen] = useState();
  const onStateChange = () => setOpen(!open);
  const [statusAuth, setStatusAuth] = useState(true)
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
  //indicator
  const [animating, setAnimating] = useState(false)
  const onDismissIndicator = () => setAnimating(false);
  //
  const [loaded, setLoaded] = useState(false);
  const [carregandoAnuncio, setCarregandoAnuncio] = useState(false);
  //
  const [inDelete, setInDelete] = useState()
  const [isDialogDelete, setIsdialogDelete] = useState(false)
  const hideDialogDelete = () => { setIsdialogDelete(false) }
  function showDialogDelete(id) {
    interstitial.load();
    interstitial.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        interstitial.show();
      }
      if (type === AdEventType.CLOSED) {
        setInDelete(id)
        setIsdialogDelete(true)
      }
    })
  }

  let LOADED = false
  useEffect(() => {
    reloadGEt('INITIAL')

  }, []);


  // No advert ready to show yet
  async function reloadGEt(string) {
    try {
      const realm = await getRealm();
      setAnimating(true)
      const _user = realm.objects('User')
      console.log(_user)
      setUser(_user[0]);
      setIvatarImage(_user[0].photoURL);
      setObjUser(new UserAuth(_user[0]._id, _user[0].email, _user[0].password))

      await getNotas(_user[0]._id, 10, 1, _user[0].token)
        .then(element => {
          const { data } = element
          setNota(element.data)
          onDismissIndicator()
          if (string === 'REFRESH') {
            interstitial.load()
            interstitial.onAdEvent(type => {
              if (type === AdEventType.LOADED) {
                setTimeout(() => {
                  interstitial.show();
                }, 1200);
              }
              if (type === AdEventType.CLOSED) {
                LOADED = false
              }
            })
          }
        })
        .catch(e => {
          onDismissIndicator()
          const { response } = e
          setStatusAuth(response.status)
          onSnack(true, ExpErr(response.status, response.data), false)
        })
    } catch (error) {
      onDismissIndicator()
      onSnack(true, 'Ops! algo inesperado aconteceu', false)
    }
  }
  function onException(response) {
    onSnack(true, ExpErr(response.status, response.data), false)
  }
  async function _Ondelete(id) {
    setAnimating(true)
    hideDialogDelete()

    await onDelete(id).then(r => {

      setInDelete()
      setNota(nota.filter(element => {
        if (element._id != id) {
          return element;
        }
      }))
      onDismissIndicator()
    }).catch(e => {
      setInDelete()
      const { response } = e
      onDismissIndicator()
      if (response.status == 404) {
        setLogado(false)
      }
      onSnack(true, ExpErr(response.status, response.data), false)
    })
  }
  function onMenu(value){
    setVisible(true)
    setItemMenu(value);

  }
  function ItemNota(value) {

    return (
      value.map((data, key) => {
        const {
          _id,
          nome,
          itens,
          pagamento,
          total,
          emissao,
          descontos,
          subTotal, url
        } = data
        console.log(pagamento)
        return (
          <Card key={key} style={{ elevation: 1, backgroundColor: '#fff', marginLeft: 5, marginRight: 5, marginBottom: 5, borderRadius: 5, padding: 10 }}>

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{ fontSize: 16, color: '#757575' }}>{nome.substr(0, 20)}...</Text>
                <IconButton
                      style={{margin: -5, padding: -5}}
                        color='#9c9c9c'
                        icon='dots-vertical'
                        size={20}
                       
                        onPress={() => onMenu(data)}
                        
                      />
                             
                </View>
            
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{marginLeft: 5, fontSize: 10}}>
                {pagamento[0].dinheiro> 0?<Text style={{fontSize:12}}>Dinheiro: R$ {pagamento[0].dinheiro.toFixed(2).replace('.', ',') + ' '}</Text>: null}
                {pagamento[0].cartaoDebito> 0 ? <Text style={{fontSize:12}}>Debito: R$ {pagamento[0].cartaoDebito.toFixed(2).replace('.', ',') + ' '}</Text>: null}
                {pagamento[0].cartaoCredito> 0? <Text style={{fontSize:12}}>Crédito: R$ {pagamento[0].cartaoCredito.toFixed(2).replace('.', ',') + ' '}</Text>: null}
                {pagamento[0].outros> 0 ?<Text style={{fontSize:12}}>Outros: R$ {pagamento[0].outros.toFixed(2).replace('.', ',') + ' '}</Text>: null}
                {descontos >0 ?    <Text style={{color: '#757575',fontSize:12  }}>Descontos: R${descontos.toFixed(2).replace('.', ',') + ' '}</Text> : null}
              </View>
      

   
            
                  <Text style={{ fontSize: 18, color: '#fc6500', fontWeight: 'bold' }}>R$ {total.toFixed(2).replace('.', ',') + ' '}</Text>       
 
     </View>
               
              
    
       

              <Text style={{ fontSize: 14, color: '#9c9c9c' }}>{stringDate(emissao)}</Text>
          </Card>
        )
      })
    )


  }
  function onNavigate(route, data) {
  
    closeMenu()
    navigation.navigate(route, {data: data})

  }

  let offset = 0;
  const translateY = new Animated.Value(0);
  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY
        }
      }
    ], { useNativeDriver: true }
  )

  function onHandlerStateChange(event) {

    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = false;
      const { translationY } = event.nativeEvent;

      offset += translationY;

      if (translationY >= 100) {
        opened = true;

      } else {

        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? 380 : 0;
        translateY.setOffset(offset);
        translateY.setValue(0);
      });
    }
  }

  return (

    <Surface style={{
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#fff'
    }}>

      <Surface
        style={{
          height: 150,
          elevation: 2,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          backgroundColor: '#fff',
          transform: [{
            translateY: translateY.interpolate({
              inputRange: [-10, 0, 380],
              outputRange: [0, 0, -40],
              extrapolate: 'clamp'
            })
          }]
        }}
      >
                   <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                   anchor={positionMenu}
                    >
                    <Menu.Item icon="open-in-new" onPress={() => onNavigate('DetalheNota', itemMenu)} title="Detalhes" />

                    <Menu.Item icon="google-chrome" onPress={() => {Linking.openURL(itemMenu.url) }} title="Abrir NF-e" />
                    <Menu.Item icon="delete" onPress={() => showDialogDelete(_id)} title="Deletar" />
                    <Divider />
                  </Menu>

        <BoxRow style={{ flex: 1, alignItems: 'center', marginTop: 0, justifyContent: 'space-between'}}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginTop: 5 }}>

            <Submit style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('Despensa')}>
              <Image
                style={{ width: 40, height: 56 }}
                source={require('../../image/icon-xxxhdpi.png')}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginLeft: 5, color: '#000' }}>Despensa</Text>
            </Submit>

          </View>
          <View color='#000' style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>

            <Text style={{ fontSize: 18, color: '#000' }}>{user ? ` Olá, ${user.first_name != "" ? user.first_name : user.name}` : 'Olá, Visitante'}</Text>
            {avatarImage === 'photoURL' ?
              null
              :
              <Avatar.Image size={35} source={{ uri: avatarImage }} />
            }

          </View>
        </BoxRow>
      </Surface>
      <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <Grap translateY={translateY} />
        <TabsBox translateY={translateY} />
        <View></View>
      </View>



      <PanGestureHandler
        onGestureEvent={animatedEvent}
        onHandlerStateChange={onHandlerStateChange}
      >

        <ViewCard style={{
          transform: [{
            translateY: translateY.interpolate({
              inputRange: [-50, 0, 360],
              outputRange: [-10, 0, 520],
              extrapolate: 'clamp'
            })
          }],
        }}>

          <Title style={{ textAlign: 'center', color: '#c7c7c7', fontSize: 14 }}>Últimos lançamentos</Title>
          {animating ?
            <ActivityIndicator animating={animating} />
            :
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: -10 }}>
              <IconButton icon='refresh' style={{ textAlign: 'center' }} color='#c7c7c7' onPress={() => reloadGEt('INITIAL')} size={20} clor='#505050' />
            </View>
          }
          <MenssagemLength data={{ tamanho: nota.length, message: 'Você não possui lançamentos' }} />

          <View style={{borderRadius: 5, margin: 5, padding: 5}}>
          {ItemNota(nota)}
          </View>

         

        </ViewCard>
      </PanGestureHandler>
      <FAB.Group
        style={{ alignItems: 'center' }}
        visible={true}
        open={false}
        color={'#fff'}
        icon="qrcode-scan"
        size={40}
        onStateChange={onStateChange}
        actions={[]}
        onPress={() => navigation.navigate('Camera')}
      />
      <Portal>
        <Dialog visible={isDialogDelete} onDismiss={hideDialogDelete}>
          <Dialog.Content>
            <Subheading style={{ textAlign: 'center', color: '#c7c7c7', marginBottom: 15 }}>Tem certeza que deseja excluir a nota?</Subheading>
            <BoxRow style={{ justifyContent: 'space-between' }}>
              <Button mode='outlined' style={{ width: '45%' }} onPress={() => hideDialogDelete()}>Cancelar</Button>
              <Button mode='contained' style={{ width: '45%' }} onPress={() => _Ondelete(inDelete)}>Confirmar</Button>
            </BoxRow>
          </Dialog.Content>
        </Dialog>
      </Portal>
      {statusAuth === 401 ?
        <Snackbar
          visible={visibleSnack}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Logar',
            onPress: () => { objUser.onSingIn() }
          }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {messageSnack}
          </Text>
        </Snackbar> :
        <Snackbar
          visible={visibleSnack}
          style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#f64a4a' }}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Sair',
            onPress: () => { onDismissSnackBar() }
          }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {messageSnack}
          </Text>
        </Snackbar>}
    </Surface>

  );
}
