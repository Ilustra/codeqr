import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, List, Qtd, Nome, Submit} from './style';
import {AddQuantidade} from '../../saveRepository/RepositoryProduto';

export default function Repository({data}) {
  function Add(Element) {
    const produto = {
      id: Element.id,
      nome: Element.nome,
      quantidade: Element.quantidade + 1,
    };
    AddQuantidade(produto);
  }
  function reloadQuantidade() {
    return <Qtd>{data.quantidade}</Qtd>;
  }
  function Remove(repo) {}

  return (
    <Container>
      {reloadQuantidade()}
      <Nome>{data.nome}</Nome>
      <Submit>
        <Icon onPress={() => Remove(data)} size={30} name="remove" />
      </Submit>
      <Submit>
        <Icon onPress={() => Add(data)} size={30} name="add" />
      </Submit>
    </Container>
  );
}
