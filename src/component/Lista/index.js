import React, { useState, useEffect } from 'react';
import { Text, View, StatusBar } from 'react-native';
import {
  Container,
  Body,
  Box,
  TabText,
  BoxRow,
  ListF,
} from './style';
//UUID
var uuid = require('react-native-uuid');

import MenssagemLength from '../MenssagemLength';
import { stringDate } from '../bibliotecas_functions'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FAB, List, Portal, Surface, TextInput, Button, Dialog, Title, Snackbar, Divider, RadioButton } from 'react-native-paper';


import getRealm from '../../services/realm';


export default function Lista({ navigation }) {
  const [lista, setLista] = useState([])

  const [inputNome, setInputNome] = useState('')
  const [checked, setChecked] = useState('lista')

  const [onDeleted, setOndeleted] = useState({})
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isConfirmDelet, setIsConfirmDelet] = useState(false)
  //snack
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('');
  const [styleSnack, setStyleSnack] = useState(false)
  const onDismissSnackBar = () => setVisibleSnack(false);

  useEffect(() => {
    async function getLista() {
      try {
        const realm = await getRealm();
        const realmObj = realm.objects('Lista')
        const obj = [...realmObj];

        setLista(obj)
      } catch (error) {
        console.log('listas', error)
      }
    }
    getLista();
  }, []);

  const _onStateChange = () => setOpen(open);

  const _hideDialogCreateLista = () => setIsOpenDialog(false);
  const _hideDialogConfirmDelet = () => setIsConfirmDelet(false);

  const _openDialogCreateLista = () => setIsOpenDialog(true);

  function confirmDeleteList(data) {
    setIsConfirmDelet(true)
    setOndeleted(data)
  }
  async function onDeleteList(delet_lista) {

    try {
      const realm = await getRealm();

      realm.write(() => {
        realm.delete(delet_lista)
      })
      const obj = realm.objects('Lista');
      setLista(obj)
      _hideDialogConfirmDelet()
//      onSnack(true, 'Lista deletada', true)
    } catch (error) {
      console.log(error)
      onSnack(true, 'falha ao deletar', false)
    }
  }
  async function onCreateList(nome, tipo) {
    try {
      const realm = await getRealm();
      realm.write(() => {
        realm.create('Lista', { id: uuid.v1(), nome, tipo: tipo })
      })
      const obj = realm.objects('Lista')
      _hideDialogCreateLista()
      setLista(obj)
      setInputNome('')
      onSnack(true, 'Lista criada com sucesso!!', true)
    } catch (error) {
      onSnack(true, 'falha ao criar', false)
    }
  }

  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }

  function ItemList({ data }) {
    return (
      <List.Accordion 
    
      description={stringDate(data.updatedAt)} 
      title={data.nome} 
      id={data.id} 
       
    style={{ backgroundColor: '#fff' }} >
        <List.Item onPress={() => navigation.navigate('ViewLista', data.id)} style={{ marginRight: -50 }} title={data.items.length + ' item(s)'}
          left={props => <List.Icon {...props} icon="open-in-new" />}
        />
        <Button onPress={() => confirmDeleteList(data)}>Deletar</Button>
      <Divider />
      </List.Accordion>
    )
  }
  return (
    <Surface style={{ padding: 5, flex: 1 }}>
      <Body>
        <View>
          <Title style={{ textAlign: 'center', color: '#c7c7c7', fontSize: 16 }}>Minhas listas</Title>
        </View>
        <Surface style={{ flex: 1, borderWidth: 1, borderColor: '#f2f2f2', backgroundColor: '#fff', borderRadius: 10, margin: 5, padding: 5 }}>
          <MenssagemLength data={{ tamanho: lista.length, message: 'Você não possui listas' }} />
          <ListF
            data={lista}
            keyExtractor={item => String(JSON.stringify(item.id))}
            renderItem={({ item }) => <ItemList data={item} />}
          />
        </Surface>
      </Body>
      <FAB.Group
        visible={true}
        open={open}
        color={'#fff'}
        icon="plus"
        size={30}
        actions={[
          { icon: 'pencil-plus', onPress: () => _openDialogCreateLista() },
        ]}
        onStateChange={_onStateChange}
        onPress={() => _openDialogCreateLista()}
      />
      <Dialog visible={isOpenDialog} onDismiss={_hideDialogCreateLista}>
        <Dialog.Content>
          <Text style={{ margin: 5, textAlign: 'center' }}>Crie uma nova lista de compras</Text>
          <Box style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <TextInput
              style={{ backgroundColor: '#fff' }}
              label="De um nome a sua lista"
              color='#fc6500'
              value={inputNome}
              onChangeText={setInputNome}
            />
          </Box>
          <Button icon='plus' onPress={() => onCreateList(inputNome, 'lista')} mode='contained' style={{ alignItems: 'center', justifyContent: 'center' }}>
            Criar
          </Button>
        </Dialog.Content>
      </Dialog>
      <Dialog visible={isConfirmDelet} onDismiss={_hideDialogConfirmDelet}>
        <Dialog.Content>
          <Box style={{ margin: 10 }}>
            <Title style={{ textAlign: 'center' }}>Deseja excluir a lista {onDeleted.nome}?</Title>
          </Box>
          <BoxRow style={{ justifyContent: 'space-between' }}>
            <Button mode='contained' onPress={() => onDeleteList(onDeleted)}>Confirmar</Button>
            <Button mode='outlined' onPress={_hideDialogConfirmDelet}>Cancelar</Button>
          </BoxRow>
        </Dialog.Content>
      </Dialog>
      <Snackbar
        visible={visibleSnack}
        style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#fcc7c7c7' }}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Sair',
          onPress: () => { onDismissSnackBar() }
        }}>
        {messageSnack}
      </Snackbar>
    </Surface>
  );
}
