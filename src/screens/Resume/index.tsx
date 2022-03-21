import React, {useEffect, useState, useCallback} from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Container,
  Header,
  Title,
  Content,
  ChartContent,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
 } from '../Resume/styles';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface TransactionData{
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string; 
}

interface CategoryData{
  key: string,
  name: string,
  total: number,
  totalFormatted: string,
  color: string, 
  percent: string;
}
export function Resume(){
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme = useTheme()
  const {user} = useAuth();
  //Lidando com a mudança das datas em Resumo
  function handleDateChange(action: 'next' | 'prev'){

    if(action === 'next'){
        setSelectedDate(addMonths(selectedDate, 1));//adicionando mais 1
    }else{
      setSelectedDate(subMonths(selectedDate, 1));//adicionando mais 1
    }
  }

  async function loadData(){
    setIsLoading(true);

      //Definindo a chave da nossa coleção
      const dataKey = `@gofinances:transactions_user:${user.id}`;
      //Recuperando todos os dados que estão no AsyncStorage
      const response = await AsyncStorage.getItem(dataKey);
      //Convertendos os dados do "data", para objetos json. caso contrario traga um array vazio
      const responseFormatted = response ? JSON.parse(response) : [];

      const expensives = responseFormatted
      .filter((expensive: TransactionData) => expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
      );

      const expensivesTotal = expensives
      .reduce((acumullator: number, expensive: TransactionData)=> {
        return acumullator + Number(expensive.amount)
      }, 0)
      console.log(expensivesTotal)

      const totalByCategory: CategoryData[] = [];
      //ForEach percorre o objeto JSON sem retornar o objeto inteiro
      categories.forEach(category => {
        let categorySum = 0;

        //Vamos percorrer todos os gastos verificando se cada categoria dos gastos é igual a categoria que estamos percorrendo. 
        //
        expensives.forEach((expensive: TransactionData) => {
          if(expensive.category === category.key){
            categorySum += Number(expensive.amount);
          }
        })

        //O push vai adicionar um novo array nas nossas categorias 
        if (categorySum > 0) {
            const totalFormatted = categorySum.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })

            //toFixed(0) diz que eu quero apenas 1 casa decimal
            const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

            totalByCategory.push({
              key: category.key,
              name: category.name,
              color: category.color,
              total: categorySum,
              totalFormatted,
              percent
            })
        }

      })
      setTotalByCategories(totalByCategory)
      setIsLoading(false);
  }
   //Atualiza a pagina juntamente com as alterações de cadastro
  useFocusEffect(useCallback(()=>{
    loadData()
  },[selectedDate]));
  return(
    <Container>
      <Header>
        <Title>Resumo por Categoria</Title>
      </Header>
        {
        isLoading ? 
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary}
            size = 'large'
          />
        </LoadContainer> :
        <Content 
          showsVerticalScrollIndicator = {false}
          contentContainerStyle = {{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
        >
        <MonthSelect>
          <MonthSelectButton onPress={()=> handleDateChange('prev')}>
            <MonthSelectIcon name = "chevron-left"/>
          </MonthSelectButton>
          <Month>
            {format(selectedDate, 'MMMM,YYY', {locale: ptBR})}
          </Month>
          <MonthSelectButton onPress={()=> handleDateChange('next')}>
            <MonthSelectIcon name = "chevron-right"/>
          </MonthSelectButton>
        </MonthSelect>

        <ChartContent>
          <VictoryPie 
            data = {totalByCategories}
            colorScale = {totalByCategories.map(category => category.color)}
            style = {{
              labels: {
                fontSize: RFValue(18),
                fontWeight: 'bold',
                fill: theme.colors.shape,
              }
            }}
            labelRadius = {50}
            x = "percent"
            y = "total"
          />

        </ChartContent>

      
          {
            totalByCategories.map(item => (
            <HistoryCard 
            key = {item.key}
            title = {item.name}
            amount = {item.totalFormatted}
            color = {item.color}
            />
            ))
          }  
        </Content>        
      }
    </Container>
  )
}