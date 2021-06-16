import styled from 'styled-components/native';

export const ListF = styled.FlatList.attrs({
    contentContainerStyle: {paddingHorizontal: 0},
    showsVerticalScrollIndicator: false,
  })``;
export const BoxRow = styled.View`
  flex-direction: row;
`;export const TabText = styled.Text`
  font-size: 16px;
  margin: 2px;
`;
export const BxDescriptions =styled.View`
flex-direction: row;
align-items: center;
justify-content: space-between;
background-color:#fff;
padding: 1px;
`;