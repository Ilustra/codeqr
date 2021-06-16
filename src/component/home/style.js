import styled from 'styled-components/native';
import LinearGradiente from 'react-native-linear-gradient';
import {Animated} from 'react-native';
//box
export const Container = styled.View`
  flex: 1;
  padding-top: 30px;
`;
export const Body = styled.View`
  flex: 1;
  background: #fff;
`;
export const Card = styled(Animated.View)`
  position: absolute;
  width: 100%;
  top: 0%;
  z-index: 4;
  elevation: 2;
  align-items: center;
`;
//barra de menu
export const BarMenu = styled.View`
  background: #fff;
  height: 500px;
  elevation: 2;
  z-index: 100;
  width: 95%;
  padding: 10px;
`;
export const ListaCompras = styled(Animated.View)`
  background: #fff;
  margin-bottom: 5px;
  border-radius: 10px;
  elevation: 2;
  margin: 10px;
  padding: 10px;
  width: 95%;
  flex: 3;
`;

export const BoxNotification = styled.View`
  background: red;
  border-radius: 20px;
  width: 15px;
  margin-left: 35px;
  margin-bottom: -15px;
  height: 15px;
  z-index: 10;
  justify-content: center;
  text-align: center;
`;
export const BxConected = styled.View`
  background: orange;
  width: 100%;
`;

export const BoxHeader = styled.View`
  flex: 1;
`;

export const MunuIcon = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const BoxRow = styled.View`
  flex-direction: row;
`;
export const Box = styled.View``;
// textex
export const TabTitle = styled.Text`
  color: #c7c7c7;
  text-align: center;
  margin: 5px;
`;
export const TabNome = styled.Text`
  color: #536e72;
`;
export const TextWhitesmoke = styled.Text`
  color: #000;
  font-size: 12px;
  text-align: center;
`;

//buton - SUBMIT
export const Submit = styled.TouchableOpacity`
  justify-content: center;
  border-radius: 4px;
  padding: 0 5px;
`;
export const List = styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 5},
  showsVerticalScrollIndicator: false,
})``;
