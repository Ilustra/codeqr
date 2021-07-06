import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Dashbard from '../dashboard';
import Listas from '../Lista';
import Notas from '../notas';
import ReportMeta from '../report-meta';

const Tab = createMaterialBottomTabNavigator();

export default function HomeScreen() {

  return (
    <Tab.Navigator
      initialRouteName="Dashbard"
      activeColor="#000"
      inactiveColor="#c7c7c7"
      barStyle={{ }}
    >
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
     
      <Tab.Screen
        name="Dashbard"
        component={Dashbard}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
       <Tab.Screen
        name="Listas"
        component={Listas}
        options={{
          tabBarLabel: 'Listas',
          tabBarIcon: ({ color }) => (
            <Icon name="reorder" color={color} size={26} />
          ),
        }}
      />      
        <Tab.Screen
        name="ReportMeta"
        component={ReportMeta}
        options={{
          tabBarLabel: 'Relatório',
          tabBarIcon: ({ color }) => (
            <Icon name="trending-up" color={color} size={26} />
          ),
        }}
      /> 
    </Tab.Navigator>
  
  );
}
