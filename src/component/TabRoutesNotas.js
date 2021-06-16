import React, {useState, useEffect} from 'react';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StatusBar, View} from 'react-native';

import Notas from './notas';

import MonthBalance from './MonthBalance';
const Tab = createMaterialTopTabNavigator();

export default function TabRoutesNotas() {
  return (
    <>
      <View style={{height: StatusBar.currentHeight}} />
      <Tab.Navigator
        name="Balance"
        tabBarOptions={{
          labelStyle: {color: '#fff'},
          tabStyle: {},
          style: {backgroundColor: '#fc6500'},
        }}>
        <Tab.Screen
          options={{tabBarLabel: 'Mês'}}
          name="MonthBalance"
          component={MonthBalance}
        />
        <Tab.Screen name="Notas" component={Notas} />
      </Tab.Navigator>
    </>
  );
}
