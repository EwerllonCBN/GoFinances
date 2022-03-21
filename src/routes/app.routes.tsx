import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
//Desestruturar dois componentes importantes, para criação das navegaçoes.
const {Navigator, Screen} = createBottomTabNavigator()

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';
//Vamos retornar um contexto de navegação
//Navigator é como uma caixa que guarda pra gente nossas telas de navegação

export function AppRoutes(){
  const theme = useTheme()

  return(
    <Navigator 
      screenOptions={{
        headerShown: false, //HeaderShown desabilita o cabeçalho que o tab navigation estabelece por padrão
        tabBarActiveTintColor: theme.colors.secundary, //Define uma cor quando o menu estiver Ativo
        tabBarInactiveTintColor: theme.colors.text, //Define a cor quando o menu estiver Inativo
        tabBarLabelPosition: 'beside-icon', //Permite que o Icon fique ao lado do Name
        tabBarStyle: {
          height: 60,
          paddingVertical: Platform.OS === 'ios' ? 5 : 0, //
        }
      }} //Vamos passar um objetos e passar propriedades, para configurar nossa navegação
    >
      <Screen 
        name='Listagem'
        component={Dashboard} //Qual o componente que deverá ser renderizado quando essa opção for ativada.
        options={{
          tabBarIcon: (({size, color})=> 
            <MaterialIcons 
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Screen 
        name='Cadastrar'
        component={Register} //Qual o componente que deverá ser renderizado quando essa opção for ativada.
        options={{
          tabBarIcon: (({size, color})=> 
            <MaterialIcons 
              name="attach-money"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Screen 
        name='Resumo'
        component={Resume} //Qual o componente que deverá ser renderizado quando essa opção for ativada.
        options={{
          tabBarIcon: (({size, color})=> 
            <MaterialIcons 
              name="pie-chart"
              size={size}
              color={color}
            />
          )
        }}
      />
    </Navigator>
  )
}