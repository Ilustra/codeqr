import styled from 'styled-components/native';

//item da lista de compras
export const Body = styled.View`
  flex: 1;
`;

export const Container = styled.View`
  flex: 1;
`;
export const Box = styled.View`

`;

export const BoxItem = styled.View`
  flex-direction: row;

  justify-content: space-between;
  align-items: center;
  border-color: #eee;
  background: #fff;
  border-radius: 10px;
  padding: 5px;
  border-bottom-width: 1px;
`;

export const BoxRow = styled.View`
  text-align: center;
  flex-direction: row;
`;

export const TabNome = styled.Text`
  text-align: center;
  color: #000;
  font-size: 15px;
`;
export const MessageText = styled.Text`
  text-align: center;
  color: ${props => (props.error ? '#fd6e6e' : ' #00C441')}
  font-size: 15px;
`;

export const TabDescricao = styled.Text`
  text-align: center;
  width: 170px;
  font-size: 15px;
  font-weight: 900;
`;
export const TabText = styled.Text`
  text-align: center;
`;

export const TabItem = styled.Text`
  flex-direction: row;
  padding: 5px;
`;

export const TabHeader = styled.View`
  background: #fff;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const Input = styled.TextInput.attrs({placeholderTextColor: '#999'})`
  border-radius: 4px;
  padding: 0px;
  font-size: 16px;
  color: #333;
  margin-right: 5px;
  background: #ffff;
  height: 50px;
  border-width: 1px;
  border-color: #f1f1f1;
  text-align: center;
`;
export const Submit = styled.TouchableOpacity`
  justify-content: center;
  text-align: center;
  align-items: center;
  border-radius: 4px;
  padding: 0px;
  border-color: #fafafa;
`;export const BoxSubmit = styled.TouchableOpacity`
  padding: 0px;
  margin: 0px;
  flex-direction: row;
  color:${props=> props.isSelect ? '#ffff' : '#909090'}
  
  justify-content: space-between;
  align-items: center;
  padding: 5px;


  background: ${props=> props.isSelect ? '#ff7f7f' : '#ffff'}
  `;
//List FlastList
export const ListF =styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 0},
  showsVerticalScrollIndicator: false,
})`
  padding: 0px;
  margin: 0px;
`;