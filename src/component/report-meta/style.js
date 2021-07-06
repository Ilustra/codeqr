import styled from 'styled-components/native';

export const ListF = styled.FlatList.attrs({
    contentContainerStyle: {paddingHorizontal: 0},
    showsVerticalScrollIndicator: false,
  })``;
export const BxDescriptions =styled.View`
flex-direction: row;
align-items: center;
justify-content: space-between;
`;
export const TxYear =styled.Text`
  font-size: 18px;
  font-weight: bold;
  color:#909090;
  margin: 0px;
`;
export const TxMonth =styled.Text`
  font-size: 14px;
`;
export const Txt = styled.Text`

`;