import React from "react";
import { categories } from "../../utils/categories";
import { FlatList} from 'react-native';
import { Button } from "../../components/Forms/Button";
import { 
  Container, 
  Header, 
  Title,
  Category, 
  Icon, 
  Name, 
  Separator,
  Footer,
} from "./styles";

interface Category{
  key: string;
  name: string;
}

interface Props{
  category: Category,
  setCategory: (category: Category)=> void,
  closeSelectCategory: ()=> void;
}

export function CategorySelect({category, setCategory, closeSelectCategory} : Props){

  function hundleCategorySelect(category: Category  ){
    setCategory(category);
  }

  return(
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>
      
      <FlatList 
        data={categories}
        style={{flex: 1, width: '100%'}}
        keyExtractor={(item)=> item.key}
        renderItem={({ item })=> (
          <Category 
            onPress={()=> hundleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon}/>
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={()=> <Separator />}
        
      
      />
      <Footer >
        <Button title="Selecionar" onPress={closeSelectCategory}/>
      </Footer>
    </Container>
  )
}