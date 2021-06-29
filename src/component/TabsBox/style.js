import styled from 'styled-components/native';
import LinearGradiente from 'react-native-linear-gradient';
import {Animated, StatusBar} from 'react-native';

export const TabsContainer = styled.ScrollView.attrs({
    horizontal: false,
    contentContainerStyle: { paddingLeft: 0, paddingRight: 0},
    showsHorizontalScrollIndicator: false,
  })``;
export const Container = styled(Animated.View)`
  opacity: 0.2;
  margin-top: 0px;
  background-color:#fff
`;
//buton - SUBMIT
export const Submit = styled.TouchableOpacity`
    flex-direction: row;
    font-size: 14px;
    padding: 5px;
    align-items: center;
`;
