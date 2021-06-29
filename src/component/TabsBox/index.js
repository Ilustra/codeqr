
import React, { useEffect, useState } from 'react';
import { Surface, Button, Portal, IconButton, Dialog, Snackbar, Avatar, Title, ActivityIndicator, Colors, Divider, List, FAB, Subheading } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Text, Animated, View, Image, addons } from 'react-native';

//style
import {
  Submit,
  TabsContainer,
  Container
} from './style';
//componenentes
import { useNavigation } from '@react-navigation/native';

export default function TabsBox({ translateY }) {

    const navigation = useNavigation();


   function onNavigate(url){

    navigation.navigate(url)
   } 
return(
    <Container style={{
      flex: 2,
       alignItems:'center',
        transform: [{
          translateY: translateY.interpolate({
            inputRange: [0, 380],
            outputRange: [0, -30],
            extrapolate: 'clamp',
          }),
        }],
        opacity: translateY.interpolate({
          inputRange: [0, 380],
          outputRange: [0, 0.9],
          extrapolate: 'clamp',
        }),        
      }}>
              <Surface style={{      width:250, borderRadius: 10, elevation: 1, backgroundColor:'#fff'}}>

              <Button style={{backgroundColor:'#fff'}} icon="window-open" mode="contained" onPress={() => { onNavigate('Despensa') }}>
           Despensa
  </Button>                
   <Button style={{backgroundColor:'#fff'}} icon="file-search" mode="contained" onPress={() => { onNavigate('SerachProducts') }}>
              Buscar Produtos
  </Button>            
    <Button style={{backgroundColor:'#fff'}} icon="chart-line" mode="contained" onPress={() => { onNavigate('Relatorio') }}>
    Relatorio
  </Button>   
   <Button style={{backgroundColor:'#fff'}} icon="account-circle" mode="contained" onPress={() => { onNavigate('Perfil') }}>
   Perfil
  </Button>


            </Surface>

          </Container>

)
}