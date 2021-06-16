import React from 'react';
import {View, Text} from 'react-native';
import {Container} from './style';
export default function MenssagemLength({data}) {
  if (data.tamanho < 1) {
    return (
      <Container style={{}}>
        <Text
          style={{
            textAlign: 'center',
            color: '#c7c7c7',
            fontSize: 18,
          }}>
          {data.message}
        </Text>
      </Container>
    );
  } else {
    return <></>;
  }
}
