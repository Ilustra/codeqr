import styled from 'styled-components/native';
import {StatusBar} from 'react-native';
export const Body = styled.View`
  flex: 1;
  margin-top: ${StatusBar.currentHeight}px;
  background: #fff;
`;
export const Container = styled.View`
  flex: 1;
  background: #fc6500;
`;
export const BOXSCANN = styled.View`
  height: 250px;
  width: 150px;
  flex-direction: row;
`;
export const BoxTexte = styled.View`
  position: absolute;
  height: 100%;
  width: 100%;
  justify-content: space-between;
`;
export const BoxRow = styled.View`
  flex-direction: row;
`;
export const Box = styled.View`
  justify-content: space-between;
`;

export const BarLefthTop = styled.View`
  width: 5px;
  height: 50px;
  border-bottom-right-radius: 5px;
  background: #fc6500;
`;
export const BarLefthBotton = styled.View`
  width: 5px;
  height: 50px;
  background: #fc6500;
  border-top-right-radius: 5px;
`;

export const BarTopLefth = styled.View`
  width: 50px;
  height: 5px;
  background: #fc6500;
  border-bottom-right-radius: 5px;
`;
export const BarBottonLefth = styled.View`
  width: 50px;
  height: 5px;
  background: #fc6500;
  border-top-right-radius: 15px;
`;

export const BarTopRigth = styled.View`
  width: 50px;
  height: 5px;
  background: #fc6500;
  border-bottom-left-radius: 15px;
`;
export const BarBottonRigth = styled.View`
  width: 50px;
  height: 5px;
  background: #fc6500;
  border-top-left-radius: 15px;
`;

export const BarRithTop = styled.View`
  width: 5px;
  height: 50px;
  background: #fc6500;
  border-bottom-left-radius: 15px;
`;
export const BarRithBotton = styled.View`
  width: 5px;
  height: 50px;
  background: #fc6500;
  border-top-left-radius: 15px;
`;

export const BoxScanRigth = styled.View`
  background: #646464;
  opacity: 0.8;
  flex: 1;
  flex-direction: row;
  width: 50px;
`;
export const BoxScanLeft = styled.View`
  background: #646464;
  opacity: 0.8;
  width: 50px;
  flex: 1;
  border-color: red;
`;
export const BoxScanBotton = styled.View`
  background: #646464;
  opacity: 0.8;
  flex: 2;
  align-items: center;
  justify-content: center;
`;
export const BoxScanTop = styled.View`
  background: #646464;
  opacity: 0.8;
  flex: 2;
`;
export const CXCamera = styled.View`
  flex: 1;
  width: 25%;
  flex-direction: column;
`;
export const BoxInfo = styled.View`
  background: #fff;
  padding: 10px;
  z-index: 1;
`;
export const BoxNotaScanner = styled.View`
  margin-bottom: 10px;
  background: #000;
`;
export const BoxSubmit = styled.View`
  background: ${props => (props.error ? '#fc6500' : '#fff')};
  justify-content: center;
  align-items: center;
  border-radius: 30px;
  padding: 0px;
`;
export const URLtext = styled.Text`
  padding: 10px;
  background: #000;
`;

export const Submit = styled.TouchableOpacity`
  background: #fff;
  align-items: center;
  padding: 0px;
  width: 50px;
  height: 50px;
`;
