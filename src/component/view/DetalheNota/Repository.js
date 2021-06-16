
import React, { useEffect, useState } from 'react';

import {View, Text} from 'react-native'
import {ListF, Name, BoxDue, Box, BoxRow, Total, TabText, Submit} from './style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { List, Divider, Portal, Dialog, Snackbar, Surface } from 'react-native-paper';
import MenssagemLength from '../../MenssagemLength'
import getRealm from '../../../services/realm';

var uuid = require('react-native-uuid');
export default function Produtos({data}) {

  const [isVisibleDialogConfirm, setIsVisibleDialogConfirm] = useState(false);
  const [despensas, setDespensas] = useState([]);
  const [itemPush, setItemPush] = useState();
  const _hideDialogConfirm = () => setIsVisibleDialogConfirm(!isVisibleDialogConfirm);

    //snack
    const [visibleSnack, setVisibleSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');
    const [styleSnack, setStyleSnack] = useState(false)
    const onDismissSnackBar = () => setVisibleSnack(false);

    function onSnack(status, message, style) {
      setVisibleSnack(status);
      setMessageSnack(message)
      setStyleSnack(style)
    }

    useEffect(() => {
      async function loadRepository() {

        try {
          const realm = await getRealm();
          const _despensas = realm.objects('Lista')
          console.log('fs',_despensas)
          setDespensas(_despensas)
        } catch (error) {
          console.log('x', error)
        }
  
      }
      loadRepository();
    }, []);

    function openPushITem(data){
      setItemPush(data)
      setIsVisibleDialogConfirm(true)
    }

    function RepoDespensas({ data }) {
      async function pushItems(item, id) {
        const { nome, quantidade, UN, valor, total} = item
        const realm = await getRealm();
        try {

          realm.write(() => {
            let lista = realm.objects('Lista').filtered('id=' + JSON.stringify(id))
            lista[0].items.push({ id: uuid.v1(), nome: nome, quantidade: quantidade, UN: UN, valor: parseFloat(valor), total: parseFloat(total) })
  
          })
          //
          onSnack(true, 'Unidade(s) adicionada(s)', true)
        } catch (error) {
          onSnack(true, error, true)

        }
      }
      return (
        <>
          <List.Item
            title={data.nome}
            description={data.tipo}
            onPress={() => { pushItems(itemPush, data.id) }}
          />
          <Divider />
        </>
      )
    }

  return (
    <>
    <View style={{ flexDirection: 'row', alignItems:'center', justifyContent: 'space-between', margin: 5}}>
        <Box>
          <Box>
            <Name style={{width: 200, fontSize: 16}}>{data.nome} </Name>
            <BoxDue>
              <TabText>Cod: {data.codigo}</TabText>
              <TabText>UN: {data.UN}</TabText>
              <TabText>Qtd: {data.quantidade.toFixed(2)}</TabText>
              <TabText>R$: {data.valor.toFixed(2)}</TabText>
            </BoxDue>
          </Box>
        </Box>
        <Total>R$: {data.total.toFixed(2)}</Total>
        <Submit onPress={()=> openPushITem(data)}>
          <Icon color='#909090' name='playlist-add' size={30} />
        </Submit>

    </View>
    <Divider />

    <Portal>
        <Dialog visible={isVisibleDialogConfirm} onDismiss={_hideDialogConfirm}>
          <Dialog.Content tyle={{flex:1}}>

            <Box style={{marginBottom:10}}>
              <Text style={{ textAlign: 'center', color:'#505050' }}>Pressione em qual lista deseja  inserir o produto</Text>
              <Divider />
            </Box>


            <View >
              <ListF
                data={despensas}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => <RepoDespensas data={item} />}
              />
            </View>
            <View style={{margin: 10}}>
            <MenssagemLength data={{message: 'Você não possui lista(s)', tamanho: despensas.length}} />
            </View>


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
        </Portal>
    </>
  );
}
