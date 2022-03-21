import React from "react";
import { AppRegistry } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { 
  Container,
  Category,
  Icon,
} from './style'

interface Props{
  title: string,
  onPress: ()=> void,
}

export function CategorySelectButton({title, onPress} : Props){
  return(
    <GestureHandlerRootView>
      <Container onPress={onPress}>
        <Category>{title}</Category>
        <Icon name="chevron-down" />
      </Container>
    </GestureHandlerRootView>
  )
}
