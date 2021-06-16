import styled from 'styled-components/native';

export const Body = styled.View`
  flex: 1;
  background: #fff;
`;
export const Container = styled.View`
  flex: 2;
  padding: 10px;
  background: #fff;
`;
export const TabForm = styled.View`
  padding: 10px;
  flex: 2;
  justify-content: space-between;
`;
export const TabFormGroup = styled.View`
  margin: 3px;
`;
export const TabLabel = styled.Text`
  color: #878787;
`;
export const Input = styled.TextInput.attrs({placeholderTextColor: '#999'})`
  padding: 0px;
  font-size: 16px;
  color: #333;
  margin-right: 5px;
  border-bottom-width: 1px;
  border-bottom-color: #878787;
  height: 30px;

  text-align: center;
`;
export const Submit = styled.TouchableOpacity`
  border-radius: 4px;
  padding: 0 5px;
  width: 85%;
  padding: 10px;
  z-index: 100;
  align-items: center;
  border: solid;
`;
export const BoxSubmit = styled.View`
  align-items: center;
  padding: 10px;
  margin: 10px;
`;
export const BoxRow = styled.View`
  flex-direction: row;
`;
export const Box = styled.View``;
