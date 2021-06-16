import React, {Component} from 'react';

import {Data} from './Repository';
import {Container, List, Text} from './style';
import {DATAs, NOTAS} from './DATA';
//
import ViewProduto from '../view/viewNotasNFE';

import axios from 'axios';

export default function notasNFE({navigation: {navigate}}) {
  async function saveData(repository) {
    NOTAS.push(repository);
  }

  async function getDatos() {
    try {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:3000/auth/user/5e6a9ddfd7e30b1f1c517ff4',
      });
      await saveData(response.data);
    } catch (err) {
      alert(JSON.stringify(`erro ao ao buscar: ${err}`));
    }
  }
  getDatos();
  return (
    <Container>
      <List
        keyboardShowldPersistTaps="handled"
        data={DATAs.notas}
        keyExtractor={item => item._id}
        renderItem={({item}) => <ViewProduto data={item} />}
      />
    </Container>
  );
}
