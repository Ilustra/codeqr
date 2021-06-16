import styled from 'styled-components/native';

export const Container = styled.View``;

export const BtnBlack = styled.View`
  background: #000;
  padding: 10px;
  border-radius: 5px;
  align-items: center;
  color: #fff;
  margin: 10px;
  text-align: center;
`;

//Textos
export const TextWhite = styled.Text`
  color: white;
  text-align: center;
`;
export const TextWhitesmoke = styled.Text`
  color: #000;
  font-size: 12px;
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
