import styled from 'styled-components/native';
import LinearGradiente from 'react-native-linear-gradient';
import {Animated, StatusBar} from 'react-native';

export const TabsContainer = styled.ScrollView.attrs({
    horizontal: true,
    contentContainerStyle: { paddingLeft: 10, paddingRight: 20 },
    showsHorizontalScrollIndicator: false,
  })``;
export const Container = styled(Animated.View)`
  margin-top: 0px;
  margin-bottom: 0px;
`;
//buton - SUBMIT
export const Submit = styled.TouchableOpacity`
    background-color:#fc6500;
    margin: 5px;
    height: 80px;
    width: 80px;
    border-radius: 10px;
`;
export const ListF = styled.FlatList.attrs({
    contentContainerStyle: {paddingHorizontal: 0},
    showsVerticalScrollIndicator: false,
  })``;
  