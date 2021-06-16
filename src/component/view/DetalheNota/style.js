import styled from 'styled-components/native';

export const Body = styled.View`
  flex: 1;
`;
export const Container = styled.View`
  flex: 1;
  background: #fff;
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
`;

export const BoxItem = styled.View`
  background: #fff;
  padding: 10px;
  border-bottom-width: 1px;
  border-color: #c7c7c7;

  margin-bottom: 5px;
`;
export const Box = styled.View``;
export const TabText = styled.Text`
  color: #909090;
  font-size: 11px;
`;
export const BoxRow = styled.View`
  flex-direction: row;
`;

//produtos ----
export const BoxDue = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Valor = styled.Text`
  font-size: 16px;
`;
export const Name = styled.Text`
  font-size: 18px;
  color: #909090;

`;
export const Total = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: #00c441;
  justify-content: space-between;
`;

//
export const ListF = styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 0},
  showsVerticalScrollIndicator: false,
})``;

export const Submit = styled.TouchableOpacity`
  color: #30B4FA;
  border-radius: 4px;

`;
