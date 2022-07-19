import React, { useContext, useState } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import LogoSvg from '../../assets/logo.svg';
import GoogleSvg from '../../assets/google.svg';
import AppleSvg from '../../assets/apple.svg';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'
import { SignInSocialButton } from "../../components/SignInSocialButton";
import { useAuth } from "../../hooks/auth";
import { ActivityIndicator, Alert, Platform } from "react-native";
import { useTheme } from "styled-components";



export function SignIn(){
  const theme = useTheme();
  const {signInWithGoogle, signInWithApple} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  //Função de disparada de login do usuario com o Google
  //Iremos usar o bloco try/catch pq se algo der errado na disparada no bloco do hook Provider, o erro será lançado pra ca, e sera tratado aqui
  async function handleSignInWithGoogle(){
    try {
      setIsLoading(true);
      return await signInWithGoogle();      
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Google');
      setIsLoading(false);
    } 
  }
  async function handleSignInWithApple(){
    try {
      setIsLoading(true);
      return await signInWithApple();      
    } catch (error) {
      console.log(error)
      Alert.alert('Não foi possível conectar a conta Apple');
      setIsLoading(false);
    }
  }
  return(
    <Container>
      <Header>
        <TitleWrapper>
        <LogoSvg            
            width = {RFValue(12)}
            height = {RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma{'\n'}
            muito simples.
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo.
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            onPress={handleSignInWithGoogle}
            title="Entrar com Google"
            svg={GoogleSvg}
          />
          { Platform.OS === 'ios' &&
            <SignInSocialButton
              onPress={handleSignInWithApple}
              title="Entrar com Apple"
              svg={AppleSvg}
            />
          }
          
        </FooterWrapper>
        { isLoading && 
          <ActivityIndicator 
            color={theme.colors.shape}
            style={{marginTop: 20}}
          />}
      </Footer>
    </Container>
  )
}