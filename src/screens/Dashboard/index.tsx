import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components';
import {useFocusEffect} from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import { 
  Container, 
  Header, 
  UserInfo, 
  UserGreeting, 
  UserName, 
  Photo, 
  User, 
  UserWrapper, 
  Icon,
  HighlightCards,
  Transactions, 
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionsCard, TransactionsCardProps } from '../../components/TransactionCard';
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DatalistProps extends TransactionsCardProps{
  id: string;
}

interface HighlightProps{
  amount: string,
  lastTransaction: string
}

interface HighlightData{
  entries: HighlightProps,
  outs: HighlightProps,
  total: HighlightProps,
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DatalistProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { signOut, user } = useAuth();
  
  function getLastTransactionsDate(
    collection: DatalistProps[],
    type: 'positive' | 'negative'
    ){
    const collectionFilttered =  collection.filter(transactions => transactions.type === type);

    if(collectionFilttered.length === 0){
      return 0;
    }

    const lastTransaction =
    new Date(
    Math.max.apply(Math, collectionFilttered
    .map(transactions => new Date(transactions.date).getTime())));

    return `${lastTransaction.getDate()} de  ${lastTransaction.toLocaleDateString('pt-BR', {month: 'long'})}` 
  }

  async function loadTransactions(){
    const dataKey = `@gofinances:transactions_user:${user.id}`; //Definindo a chave da nossa coleção
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DatalistProps[] = transactions
    .map((item: DatalistProps) => {
      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }) 
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));
      if(item.type ===  'positive'){
        entriesTotal += Number(item.amount);
      }else {
        expensiveTotal += Number(item.amount);
      }
      return{
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    })

    setTransactions(transactionsFormatted);

    const lastTransactionsEntries = getLastTransactionsDate(transactions, 'positive');
    const lastTransactionsExpensive = getLastTransactionsDate(transactions, 'negative');
    const totalInterval =  lastTransactionsExpensive === 0
    ? 'Não há transações'
    : `01 a ${lastTransactionsExpensive}`;

    const total = entriesTotal - expensiveTotal;
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionsEntries === 0 
        ? 'Não há transações' 
        :`Última entrada dia ${lastTransactionsEntries}`
      },
      outs: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionsExpensive === 0
        ? 'Não há transações' 
        : `Última saída dia ${lastTransactionsExpensive}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval
      }
    })
    setIsLoading(false);
  }
  useEffect(() => {
   loadTransactions();
  }, []);

  //Atualiza a pagina juntamente com as alterações de cadastro
  useFocusEffect(useCallback(()=>{
    loadTransactions();
  },[]));
  return (
    <Container>
      
      {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary}
            size = 'large'
          />
        </LoadContainer> :
      <>
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo source={{uri: user.photo}} />
              <User>
                <UserGreeting>Olá, </UserGreeting>
                <UserName>{user.name}</UserName>
              </User>

            </UserInfo>

            <LogoutButton onPress = {signOut} >
              <Icon name='power' color='black'/>
            </LogoutButton>
            
          </UserWrapper>
        </Header>

        <HighlightCards
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 24}}>
          <HighlightCard 
          title= "Entradas"
          amount= {highlightData.entries.amount}
          lastTransaction= {highlightData.entries.lastTransaction}
          type= "up" />
          <HighlightCard
        title= "Saídas"
        amount= {highlightData.outs.amount}
        lastTransaction= {highlightData.outs.lastTransaction}
        type= "down" />
          <HighlightCard
        title= "Total"
        amount= {highlightData.total.amount}
        lastTransaction= {highlightData.total.lastTransaction}
        type= "total" />
        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>
          
          <TransactionList 
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={({ item })=> <TransactionsCard data={item} /> } 
          />
          
          
        </Transactions>
      </>}
    </Container>
   
  );
}
