import styled from 'styled-components/native';

export const Body = styled.View`
  flex: 1;
`;
export const Container = styled.View`
  flex: 1;
`;
export const Title = styled.Text`
  font-size: 18px;
  text-align: center;
  color: #505050;
`;
export const Valor = styled.Text`
font-size: 20px;
font-weight: bold;
color: #00c441;
`;
export const TextDate = styled.Text`
  color: #c7c7c7
  font-size: 14px;
`;
export const Pagamento = styled.Text`
  color: #c7c7c7
  font-size: 14px;
`;
export const Box = styled.View``;
export const TextCenter = styled.Text`
  color: #c7c7c7
  font-size: 14px;
`;
export const TextTitle = styled.Text`
  text-align: center;
  font-size: 28px;
  color: #505050;
`;
export const TabText = styled.Text``;
export const TextSub = styled.Text`
  text-align: center;
  font-size: 19px;
  font-weight: bold;
  color: #909090;
`;
export const BoxRow = styled.View`
  flex-direction: row;
`;
export const ListF = styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 0},
  showsVerticalScrollIndicator: false,
})`
`;
export const BxDescriptions =styled.View`
flex-direction: row;
align-items: center;
justify-content: space-between;
margin: 1px;
width: 160px;
`;

export const Submit = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  border-radius: 4px;
`;
