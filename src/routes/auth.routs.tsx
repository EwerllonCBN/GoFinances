import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { SignIn } from "../screens/SignIn";

const { Navigator, Screen } = createStackNavigator();
//headerShown desabilita o cabeçalho padrão do StackNavigator.
export function AuthRoutes(){
  return(
    <Navigator screenOptions={{headerShown: false}}>
      <Screen
        name="SignIn"
        component={SignIn}
      />
    </Navigator>
  )
}