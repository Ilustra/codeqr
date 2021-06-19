import React, { Component, useEffect, useState } from 'react';
import { Text, View, StatusBar, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  ListF,
  Box,
  BoxRow,
  Valor,
  BxDescriptions
} from './style';
import { List, Button, Snackbar, Surface, Portal, Dialog, Divider, Title, DataTable, ProgressBar, Colors, Subheading } from 'react-native-paper';
import { ExpErr } from '../expecptions'
import getRealm from '../../services/realm';
import MenssagemLength from '../MenssagemLength';
import { getNotas, getBallance } from '../../Controller/ControllerNotas';
import { onGetDespensa, onPushProdutos} from '../../Controller/controller-despensa';
import { stringDate, compareListBy_id } from '../bibliotecas_functions';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

import {IDBanner} from '../variaveis'
const adUnitId = IDBanner;

var uuid = require('react-native-uuid');

export default function Notas({ navigation: { navigate } }) {
  const [user, setUser] = useState();
  const [notas, setNotas] = useState([]);
  const [despensas, setDespensas] = useState([]);
  const [listas, setListas] = useState([]);
  const [listProdutos, setListProdutos] = useState([]);
  const [onPushDespensa, setONpushDespensa] = useState([]);
  //snack
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('message');
  const [styleSnack, setStyleSnack] = useState(false)
  const onDismissSnackBar = () => setVisibleSnack(false);
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }


  const [isVisibleDialogConfirm, setIsVisibleDialogConfirm] = useState(false);
  const _hideDialogConfirm = () => setIsVisibleDialogConfirm(!isVisibleDialogConfirm);

  //paginação
  const [page, setPage] = useState(1);
  const [inIndeterminate, setInIndeterminate] = useState(false);
  const onIndeterminate = () => setInIndeterminate(true);
  const onDimissIndeterminate = () => setInIndeterminate(false);
  const itemsPerPage = 3;
  const from = page * itemsPerPage;
  const to = (page + 1) * itemsPerPage;


  //#
  useEffect(() => {
    async function loadRepository() {
      const realm = await getRealm();
      const _user = realm.objects('User')
      try {
        const _listas = realm.objects('Lista')

        setListas(_listas)

        setUser(_user[0])
        setInIndeterminate(true)
        await onGetDespensa(_user[0]._id)
        .then(response=>{
          const {data} = response
          setDespensas(data)
        })
        .catch(error=>{
          const {response} = error
          console.log(response.data)
          onSnack(true, ExpErr(response.status, response.data), false)
        })
        await getNotas(_user[0]._id, itemsPerPage, page)
          .then(element => {
            setInIndeterminate(false)
            setNotas(element.data)
          }).catch(e => {
            setInIndeterminate(false)
            const { response } = e
            onSnack(true, ExpErr(response.status, response.data), false)
          })
      } catch (error) {
        setInIndeterminate(false)
        console.log('x', error)
      }
    }
    loadRepository();
  }, []);

  async function onPage(userId, limit, pa) {
    if (pa > 0) {
      onIndeterminate()
      await getNotas(userId, limit, pa)
        .then(element => {
          setPage(pa)
          onDimissIndeterminate()
          setNotas(element.data)
        }).catch(e => {
          onIndeterminate()
          const { response } = e
          onSnack(true, response.data.error, false)
        })

    }
  }
  function RepoListas({ data }) {
    async function pushItems(data, id) {
      const { } = data
      const realm = await getRealm();
      try {

        realm.write(() => {
          let lista = realm.objects('Lista').filtered('id=' + JSON.stringify(id))
          data.produtos.forEach(element => {
            const quantidade = parseFloat(element.quantidade.toFixed(2))
            const { _id, nome, UN, valor, total } = element
            lista[0].items.push({ id: uuid.v1(), nome: nome, quantidade: quantidade, UN: UN, valor: parseFloat(valor), total: parseFloat(total) });
          })

        })
        //
        onSnack(true, 'Unidade(s) adicionada(s)', true)
      } catch (error) {
        console.log(error)
        onSnack(true, error, true)
      }
    }
    return (
      <>
        <List.Item
          title={data.nome}
          description={data.tipo}
          onPress={() => { pushItems(listProdutos, data.id) }}
        />
        <Divider />
      </>
    )
  }  
  async function pushDespensa(items, userId, despensaId, name){
    console.log(items.length)
    let newItems =[]
    items.forEach(element=>{
      const d = {
                status: false, 
                nivel: 100,
                user: user.name,
                //data que foi atualizado e por quem
                updatedAt: new Date(),
                name: element.nome,
                UN: element.UN,
                quantidade: element.quantidade,
                valor: element.valor,
                total: element.total,
                updateUser: user.nome,
                categoria: 'Geral',
                createdAt: element.emissao
      }
      newItems.push(d)
    })
      await onPushProdutos(userId, despensaId, newItems, new Date(), name)
    .then(response=> {
      const {data}  = response
      onSnack(true, 'Produtos inseridos com sucesso!', true)
    })
    .catch(error=>{
      const {response} = error
      console.log(response.data)
      onSnack(true, ExpErr(response.status, response.data), false)
    })
  }
  function RepoDespensas({ data }) {
    return (
      <>
        <List.Item
          title={data.name}
          onPress={() => { pushDespensa(listProdutos.produtos, user._id, data._id, user.name) }}
        />
        <Divider />
      </>
    )
  }

  function confirmPut(data) {
    setListProdutos(data);
    setIsVisibleDialogConfirm(true)
  }

  function Repository({ data }) {
    return (
      <Surface style={{ margin: 10, borderRadius: 10, backgroundColor:'#fff', elevation: 1, padding: 5 }}>
        <Subheading>{data.nome}</Subheading>
        <Text style={{ color: '#909090', textAlign: 'center' }}>{stringDate(data.emissao)}</Text>
        <Box style={{ padding: 5 }}>
          <Divider />
          <BoxRow
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>

            <Box style={{ margin: 5, padding: 5, borderRadius: 5 }}>
              <BxDescriptions>
                <Text >Subtotal </Text>
                <Text >R$ {data.subTotal}</Text>
              </BxDescriptions>
              {data.descontos > 0 ?
                <BxDescriptions shows={false}>
                  <Text >Desconto </Text>
                  <Text >R$ {data.descontos}</Text>
                </BxDescriptions> : null
              }
              {
                data.pagamento[0].dinheiro > 0 ?
                  <BxDescriptions>
                    <Text >Dinheiro </Text>
                    <Text >R$ {data.pagamento[0].dinheiro}</Text>
                  </BxDescriptions>
                  : null
              }
              {
                data.pagamento[0].cartaoCredito > 0 ?
                  <BxDescriptions>
                    <Text >Crédito </Text>
                    <Text >R$ {data.pagamento[0].cartaoCredito}</Text>
                  </BxDescriptions>
                  : null
              }
              {
                data.pagamento[0].cartaoDebito ?
                  <BxDescriptions>
                    <Text>Débito</Text>
                    <Text>R$ {data.pagamento[0].cartaoDebito}</Text>
                  </BxDescriptions>
                  : null
              }
              {
                data.pagamento[0].outros ?
                  <BxDescriptions>
                    <Text>Outros</Text>
                    <Text>R$ {data.pagamento[0].outros}</Text>
                  </BxDescriptions>
                  : null
              }

              <BxDescriptions>
                <Text>Qtd de Itens </Text>
                <Text> {data.itens}</Text>
              </BxDescriptions>



              <Valor>Total R$ {data.total}</Valor>
            </Box>
            < Button
              mode='text'
              onPress={() => navigate('DetalheNota', { data })}>
              <Icon name="visibility" size={30} style={{ color: '#c7c7c7' }} />
            </Button>
          </BoxRow>
        </Box>
        <Button
          color='#c7c7c7'
          mode='outlined'
          onPress={() => confirmPut(data)} icon='send'>
          <Text style={{ fontSize: 14 }}>
            Adicionar em uma lista
          </Text>
        </Button>
        <Divider />
        <Text >Tributos R$ {data.tributos}</Text>
      </Surface>
    )
  }
  return (
    <Surface style={{ flex: 1 }}>
 <MenssagemLength
          data={{ message: 'Você não possui notas.', tamanho: notas.length }}
        />
      <Surface style={{ padding: 5, flex: 1 }}>
       
        <ListF
          data={notas}
          keyExtractor={item => String(item._id)}
          renderItem={({ item }) => <Repository data={item} />}
        />

        <DataTable style={{backgroundColor:'#fff', margin: 0, padding: 0}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Button onPress={()=>{navigate('SerachProducts')}} icon='file-search'>PRODUTOS</Button>
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.floor(page)}
          onPageChange={page => onPage(user._id, itemsPerPage, page)}
          label={`${from + 1}-${to} of ${notas.length}`}
        />
          </View>
        
       
      </DataTable>
 
      </Surface>
      <ProgressBar visible={inIndeterminate} progress={0.5} indeterminate={inIndeterminate} />
      <Portal >
        <Dialog visible={isVisibleDialogConfirm} onDismiss={_hideDialogConfirm}>
          <Dialog.Content>
            <Box style={{ margim: 10 }}>
              <Text style={{ textAlign: 'center', color: '#505050' }}>Pressione em qual lista deseja  inserir o produtos</Text>
              
            </Box>
            <Divider />
            <View>
              <Text style={{fontSize: 14, color: '#c7c7c7'}}>Suas despensas</Text>
            <ListF
                data={despensas}
                keyExtractor={item => String(item._id)}
                renderItem={({ item }) => <RepoDespensas data={item} />}
              />
              <Text style={{fontSize: 14, color: '#c7c7c7'}}>Suas listas</Text>
              <ListF
                data={despensas}
                keyExtractor={item => String(item._id)}
                renderItem={({ item }) => <RepoListas data={item} />}
              />
        
              <MenssagemLength data={{ message: 'Você não possui lista(s)', tamanho: listas.length }} />
              <MenssagemLength data={{ message: 'Você não possui despensas(s)', tamanho: despensas.length }} />
        
            </View>

          </Dialog.Content>
        </Dialog>
        <Snackbar
          visible={visibleSnack}
          style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#f64a4a' }}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Sair',
            onPress: () => { onDismissSnackBar() }
          }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {messageSnack}
          </Text>
        </Snackbar>
      </Portal>

      <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
    </Surface>
  );
}
