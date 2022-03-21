import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider } from 'styled-components';
import theme from './src/global/styles/theme';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
//esse e nosso container de navegação
import { NavigationContainer } from '@react-navigation/native';
//Vamos importar nossas rotas que criamos em routes.
import { AppRoutes } from './src/routes/app.routes';
import { LogBox } from 'react-native';
import { AuthProvider, useAuth } from './src/hooks/auth';
import { Routes } from './src/routes'
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);
export default function App() {
  
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });
  const {userStorageLoading} = useAuth();
  if(!fontsLoaded || userStorageLoading){
    return <AppLoading />
  }
  return (
    //Nosso container de themas deve sempre envolver as demais, para estar disponiveis.
    <ThemeProvider theme={theme}>      
      <StatusBar barStyle="light-content"/>
        <AuthProvider>
          <Routes />
        </AuthProvider>        
    </ThemeProvider>
  
  )
}
