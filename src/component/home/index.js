import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Dashbard from '../dashboard';
import MonthBalance from '../MonthBalance';
import Notas from '../notas';

const Tab = createMaterialBottomTabNavigator();
export default function HomeScreen() {

  return (
    <Tab.Navigator
      initialRouteName="Dashbard"
      activeColor="#000"
      inactiveColor="#fff"
      barStyle={{ backgroundColor: '#fc6500' }}
    >
      <Tab.Screen
        name="MonthBalance"
        component={MonthBalance}
        options={{
          tabBarLabel: 'Lançamentos',
          tabBarIcon: ({ color }) => (
            <Icon name="timeline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Dashbard"
        component={Dashbard}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Notas"
        component={Notas}
        options={{
          tabBarLabel: 'Notas',
          tabBarIcon: ({ color }) => (

            <Icon name="receipt" color={color} size={26} />

          ),
        }}
      />     
    </Tab.Navigator>
  
  );
}
