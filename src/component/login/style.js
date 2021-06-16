import styled from 'styled-components/native';
import {StatusBar} from 'react-native';
export const Body = styled.View`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
  background: #fff;
`;
export const Container = styled.View`
  flex: 2;
  background: #fff;
`;
export const Box = styled.View`

`;
export const BoxRow = styled.View`
  flex-direction: row;

  justify-content:center;
  align-items: center;

`;
//buton - SUBMIT
export const Submit = styled.TouchableOpacity`
  justify-content: center;
  border-radius: 4px;
  padding: 0 5px;
`;
export const Input = styled.TextInput.attrs({placeholderTextColor: '#999'})`
  border-radius: 4px;
  padding: 0px;
  font-size: 16px;
  color: #333;
  margin-right: 5px;
  background: #fafafa;
  height: 50px;

  text-align: center;
`;

export const BoxLogo = styled.View`
  align-items: center;
  flex: 1;
  justify-content:center;
  align-items: center;
`;
