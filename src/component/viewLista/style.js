import styled from 'styled-components/native';

//item da lista de compras
export const Body = styled.View`
  flex: 2;
`;

export const Container = styled.View`
  flex: 1;
`;
export const Box = styled.View`
`;



export const BoxRow = styled.View`
  flex-direction: row;
`;


export const MessageText = styled.Text`
  text-align: center;
  color: ${props => (props.error ? '#fd6e6e' : ' #00C441')}
  font-size: 15px;
`;
export const TabText = styled.Text`
  color: ${props => (props.error ? '#fd6e6e' : ' #00C441')}
`;

export const Submit = styled.TouchableOpacity`
  justify-content: center;
  text-align: center;
  align-items: center;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  margin: 2px;
`;
export const BoxSubmit = styled.TouchableOpacity`
  padding: 0px;
  margin: 0px;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  `;
//List FlastList
export const ListFlat = styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 0},
  showsVerticalScrollIndicator: false,
})`
  padding: 0px;
  margin: 0px;
`;
