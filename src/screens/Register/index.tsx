import React, { useState, useEffect } from "react";
import { Alert, Modal, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
 } from "./styles";
import { InputForm } from "../../components/Forms/InputForm";
import { Button } from "../../components/Forms/Button";
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Forms/CategorySelectButton";
import { CategorySelect} from '../CategorySelect';
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'
import { useAuth } from "../../hooks/auth";

export type FormData = {
  [name: string]: any;
}

//===FAZENDO VALIDAÇÃO DE FORMULÁRIOS COM YUP====

//Iremos criar um esquema para o nosso envio de dados seguir um padrão com o resolverYup
//Esse nosso yup será um objeto no qual iremos definir sua forma "shape" desse objeto "formulario"
const schema = Yup.object().shape({
//O atributo name será uma string obrigatória "required", usando o Yup para definir as caracteristicas desse atributo name
//Caso o atributo name não seja informado, a msg será exibida
  name: Yup.string().required('Nome é obrigatório!'),

//O atributo amount será um typo number, com valor numérico, esse valor deverá ser positivo, e obrigatório.
//E utilizando o yup para definir as caracteristicas desse atributo;
  amount: Yup.number()
  .typeError('Informe um valor numérico')
  .positive('O valor não pode ser negativo')
  .required('O valor é obrigatório')
})

//Tipando o navigate para sansionar erro de tipagem no Listagem
type NavigationProps = {
  navigate: (screen:string) => void
}

export function Register(){
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',  
  })
  const navigation = useNavigation<NavigationProps>();
  const [transactionType, setTransactionType] = useState('')
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const {user} = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema) //esse yupResolver irá forçar que nosso Submit "envio de valores do nosso formulários", siga um padrão
  });
  function hundleTransactionTypeSelect(type: 'positive' | 'negative'){
    setTransactionType(type);
  }
  
  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

async function handleSubmitRegister(form: FormData) { 

  //Se não tiver nenhum tipo de transação, o alerta será exibido em tela
    if(!transactionType) {
      return Alert.alert('Selecione o tipo de transação');
    }

  //Se a key de categoria ainda for categoria, é porque ainda não foi selecionado nada
  //sendo assim, um alerta será exibido em tela.
    if(category.key === 'category') {
      return Alert.alert('Selecione a categoria');
    }
    //Objeto de transações
    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key, 
      date: new Date()
    }

    //===PERSISTENCIA DE DADOS====
    //await para esperar de salvar esses dados para ser exibidos.
    //JSON.stringfy converte o objeto para string
    //JSON.parse converse os dados em objeto
    //console.log(data!) o ! significa que estou garantindo para o JS que sempre terá algo para retornar dentro do data;
    try{

       //Definindo a chave da nossa coleção
      //Recuperando todos os dados que estão no AsyncStorage
      const data = await AsyncStorage.getItem(`@gofinances:transactions_user:${user.id}`);
      //Convertendos os dados do "data", para objetos json. caso contrario traga um array vazio
      const currentData = data ? JSON.parse(data) : [];
      
      //Objeto que pega os dados atuais e antigos do newTransaction.
      const dataFormatted = [
        ...currentData,
        newTransaction
      ];

      //Listando todos os objetos novos e antigos do dataFormatted
      await AsyncStorage.setItem(`@gofinances:transactions_user:${user.id}`, JSON.stringify(dataFormatted))

      reset();
      setCategory({
        key: 'category',
        name: 'Categoria',  
      })
      setTransactionType('');
      navigation.navigate('Listagem');
    }catch (error) {
      console.log(error);
      Alert.alert("Não foi possivel salvar");      
    }
}   
    useEffect(()=> {
      // async function loadData (){
      //   const data = await AsyncStorage.getItem(dataKey);
      //   console.log(JSON.parse(data!));
      // }
      // loadData();
      // async function removeAll () {
      //   await AsyncStorage.removeItem(`@gofinances:transactions_user:${user.id}`);
      // }
      // removeAll();
      
    }, [])

  
  return(
    //Keyboard.dimiss permite que ao clicar em qualquer area da tela, ele fechara o teclado de text.
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>

      <Form>

        <Fields>
          <InputForm 
            name="name"
            control={control} //Controle do nosso Input
            placeholder="Nome" // Permite colocar texto fixo dentro do Input
            autoCapitalize="sentences" //O autoCapitalize altera de forma automatica propriedades do texto dentro do Input;
            autoCorrect={false} //Impede que o texto dentro do Input seta auto corrigido;
            error={errors.name && errors.name.message}//Exibe mensagem de erro caso não tenha sido digitado corretamente
          />
          <InputForm
            name="amount"
            control={control}
            placeholder="Preço"
            keyboardType="numeric"//Permite a mudança de teclado dentro do Input!! 
            error={errors.amount && errors.amount.message}//Exibe mensagem de erro caso não tenha sido digitado corretamente
          />
          

          <TransactionsTypes>
              <TransactionTypeButton 
              type="up"
              title="Income"
              onPress={()=> hundleTransactionTypeSelect('positive')}
              isActive={transactionType === 'positive'}
            />
            <TransactionTypeButton 
              type="down"
              title="Outcome"
              onPress={()=> hundleTransactionTypeSelect('negative')}
              isActive={transactionType === 'negative'}
            />
          
          </TransactionsTypes>

          <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal}/>
          
        </Fields>
      
      <Button title="Enviar" onPress={handleSubmit(handleSubmitRegister)}/>
      </Form> 

      <Modal visible={categoryModalOpen}>
        <CategorySelect 
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        /> 
      </Modal> 
      </Container>
    </TouchableWithoutFeedback>
  );
}