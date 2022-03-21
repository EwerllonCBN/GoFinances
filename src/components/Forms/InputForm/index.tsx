import React from "react";
import { Container, Error} from "./styles";
import { Input } from "../Input";
import { TextInputProps } from "react-native";
import { Control, Controller } from "react-hook-form";

//Vamos tipar os Inputs, vamos chamar de Props e extender do TextInputProps
interface Props extends TextInputProps{
  control: Control, //Esse tipo Control irá controlar o nosso Input
  name: string, //Iremos definir um name pro Input, pra ele conseguir diferenciar um Input do outro dentro do forumulario,
  error: string,
}
//A propriedade ...rest, pega todas as demais propriedades possiveis que serão passadas no momento de chamar o componente.
export function InputForm({control, name, error, ...rest} : Props){
  return(
    <Container>
      <Controller
            //==RENDER== O componente quando é controlado ele vai renderizar nosso Input, e dentro desse render pegamos algumas propriedades desse Input
            //O onChange, é quando muda o conteudo do Input, o onBlur é quando você acessa esse Input, e o value é o seu valor.
        control={control}
        render={({ field: {onChange, value}  })=> (
          <Input 
            {...rest}
            onChangeText={onChange}
            value={value}
          />
        )} 
        name={name}     
     />
      {/*Se tem error então exiba*/}
     {error && <Error>{error}</Error>}
    </Container> 
  )
}
