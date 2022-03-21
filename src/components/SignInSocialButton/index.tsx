import React, { SVGProps } from "react";
import { GestureHandlerRootView, RectButtonProps } from 'react-native-gesture-handler';
import { SvgProps } from 'react-native-svg'
import {
  Button, 
  ImageContainer,
  Text,
} from './styles'
interface Props extends RectButtonProps{
  title: string;
  svg: React.FC<SvgProps> //Para dizer que estamos utilizando um tipo de componente do svg FuncionalComponents
}
export function SignInSocialButton({
  title,
  svg: Svg,
  ...rest
}: Props){
  return(
    <GestureHandlerRootView>
      <Button
        {...rest}
      >
        <ImageContainer>
          <Svg/>
        </ImageContainer>
          
        <Text>
          {title}
        </Text>
      </Button>
    </GestureHandlerRootView>
    
  )
}