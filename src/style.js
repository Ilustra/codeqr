import styled from 'styled-components/native';

export const Container = styled.View``;

//Textos
export const Text = styled.Text`
  color: white;
  text-align: center;
`;

//List FlastList
export const List = styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 20},
  showsVerticalScrollIndicator: false,
})`
  padding: 0px;
  margin: 0px;
`;
//buton - SUBMIT
export const Submit = styled.TouchableOpacity`
  justify-content: center;
  border-radius: 4px;
  padding: 0 5px;
`;
