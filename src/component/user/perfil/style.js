import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
export const Body = styled.View`
  flex: 1;

`;
export const Container = styled.View`
  flex: 1;
`;
export const BoxMeusDados = styled.View`
  border: 1px;
  margin: 5px;
  border-radius: 5px;
  padding: 5px;
  border-color: #c7c7c7;
  border-width: ${StyleSheet.hairlineWidth}px;
`;
//textos
export const TabText = styled.Text`
  font-size: 12px;
  color: #c2c2c2;
`;
export const Box = styled.View``;
export const BarMenu = styled.View`
  height: 50px;

`;
export const BoxTitle = styled.View`
  border-color: #c7c7c7c7;

`;
export const BoxRow = styled.View`
  flex-direction: row;
`;

export const Input = styled.TextInput.attrs({placeholderTextColor: '#999'})`
  border-radius: 4px;
  padding-left: 10px;
  font-size: 16px;
  color: #000;
  height: 40px;
  border-bottom-width: 1px;

`;
export const Submit = styled.TouchableOpacity`
  justify-content: center;
  text-align: center;
  align-items: center;
  border-radius: 4px;
  padding: 0 5px;
`;
