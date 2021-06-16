
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
        transform: [{
          translateY: translateY.interpolate({
            inputRange: [0, 380],
            outputRange: [0, -10],
            extrapolate: 'clamp',
          }),
        }],
        opacity: translateY.interpolate({
          inputRange: [0, 380],
          outputRange: [0, 0.9],
          extrapolate: 'clamp',
        }),        

      }}>
              <TabsContainer>
              <Submit onPress={() => { onNavigate('Despensa') }} >
                <IconButton color='#fff'  icon='window-open' size={50} style={{ padding: 0, margin: -10 }} />
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#fff' }}>Despensa</Text>
              </Submit>
              <Submit onPress={() => { onNavigate('Notas') }} >
                <IconButton color='#fff'  icon='receipt' size={50} style={{ padding: 0, margin: -10 }} />
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#fff' }}>Notas</Text>
              </Submit>
               
              <Submit >
                <IconButton color='#fff' onPress={() => { onNavigate('SerachProducts') }} icon='file-search' size={50} style={{ padding: 0, margin: -10 }} />
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#fff' }}>Buscar</Text>
              </Submit>
              <Submit onPress={() => { onNavigate('Listas') }}>
                <IconButton color='#fff'  icon='format-list-checks' size={50} style={{ padding: 0, margin: -10 }} />
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#fff' }}>Listas</Text>
              </Submit>
              <Submit onPress={() => { onNavigate('Relatorio') }} >
                <IconButton color='#fff'  icon='chart-line' size={50} style={{ padding: 0, margin: -10 }} />
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#fff' }}>Relatorio</Text>
              </Submit>
      
     
              <Submit onPress={() => { onNavigate('Perfil') }} >
                <IconButton color='#fff'  icon='account-circle' size={50} style={{ padding: 0, margin: -10, }} />
                <Text style={{ fontSize: 12, textAlign: 'center', color: '#fff' }}>Perfil</Text>
              </Submit>
            </TabsContainer>

          </Container>

)
}