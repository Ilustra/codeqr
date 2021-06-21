import styled from 'styled-components/native';
import LinearGradiente from 'react-native-linear-gradient';
import {Animated, StatusBar} from 'react-native';

export const ViewCard = styled(Animated.View)`
  flex: 1;
  position:absolute;
  background-color:#fff;
  elevation: 3;
  margin: 0 20px;
  height: 80%;
  left:0;
  right:0;
  top: 120px;
  border-radius: 20px
`;

export const Body = styled(Animated.View)`
  flex:1;
`;
//box
export const Container = styled.View`
  flex: 1;
`;

export const ListaCompras = styled(Animated.View)`
  border-radius: 10px;
  margin-bottom: 5px;
  padding: 5px;
  flex: 2;
`;
export const BxConected = styled.View`
  background: orange;
  width: 100%;
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
  text-align: center;
  margin: 5px;
`;
export const TabNome = styled.Text`
`;
//buton - SUBMIT
export const Submit = styled.TouchableOpacity`

`;
export const ListF = styled.FlatList.attrs({
  contentContainerStyle: {paddingHorizontal: 0},
  showsVerticalScrollIndicator: false,
})``;
