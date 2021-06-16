import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';

//UUID
var uuid = require('react-native-uuid');
import MenssagemLength from '../MenssagemLength';
//
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Subheading, Searchbar, Snackbar, Button, TextInput, Dialog, Surface, List, ProgressBar, Menu, IconButton, Colors } from 'react-native-paper';
//functions 
import { stringDate } from '../bibliotecas_functions'
import getRealm from '../../services/realm';
import { getProducts } from '../../Controller/controller-search'
import { getCadastro } from '../../Controller/ControllerCadastro'
import { getCEP } from '../../Controller/ControllerWebCEP';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import {IDBanner} from '../variaveis'
const adUnitId = IDBanner;


export default function SerachProducts() {
  const [searchQuery, setSearchQuery] = useState('');

  const [isDialogCep, setIsDialogCep] = useState(false)
  const hidleDialogCep = () => { setIsDialogCep(false) }

  const [cep, setCEP] = useState('');
  const [isLogInCep, setIslogInCep] = useState(false);
  const [listProducts, setListProducts] = useState([]);
  const [listFilter, setListFilter] = useState([]);
  const [region, setRegion] = useState({ localidade: '', uf: '', logradouro: '', bairro: '' });

  const [isProgress, setIsProgress] = useState(false)
  const onDismissProgress = () => { setIsProgress(false) }

  const [visibleSnack, setVisibleSnack] = useState(false);
  const [messageSnack, setMessageSnack] = useState('message');
  const [styleSnack, setStyleSnack] = useState(false)

  const onDismissSnackBar = () => setVisibleSnack(false);
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessageSnack(message)
    setStyleSnack(style)
  }

  useEffect(() => {
    async function getLista() {
      const realm = await getRealm();
      const objUser = realm.objects('User')
      await getCadastro(objUser[0]._id)
        .then(async r => {
          const { localidade, cep } = r.data
          if (r.data) {
            const aux_cep = await onCEP(cep)
            setRegion(aux_cep);
          }
        })
        .catch(e => {
          console.log(e);
        })
    }
    getLista();
  }, []);
  async function onCEP(textCEp) {
    try {
      const resp = await getCEP(textCEp)
      return resp.data
    } catch (error) {
      console.log(error);
    }
  }
  async function buscarCEP(textCEp) {
    setIslogInCep(true)
    await getCEP(textCEp)
      .then(response => {
        const { data } = response

        if (!data.erro) {
          setIslogInCep(false)
          setRegion(response.data)
          setIsDialogCep(false)
        } else {
          setRegion({ localidade: '', uf: '', logradouro: '', bairro: '' })
          setIslogInCep(false)
          onSnack(true, 'CEP inválido!!', false)
        }

      })
      .catch(error => {
        console.log('error cep', error)
        setIslogInCep(false)
      });

  }
  const onChangeSearch = async (query) => {
    setSearchQuery(query)
    setIsProgress(true)
    await getProducts(query, region.localidade)
      .then(r => {
        const { data } = r
        onDismissProgress()
        setListProducts(data)
      })
      .catch(e => {
        console.log(e)
        onDismissProgress()
      })
    onDismissProgress()
  };
  function listLista(data) {
    let list = []
    data.forEach(value => {
      let exist = false
      const listFilter = value.produtos.filter(element => {
        if (!exist) {
          const str = element.nome.toUpperCase()
          if (str.indexOf(searchQuery.toUpperCase()) > -1) {
            exist = true
            return element;
          }
        }
      })
      list = list.concat(listFilter);
    })
    function onInsertItem(nome, quantidade, un, valor) {
      setTextNome(nome)
      setTextQuantidade(quantidade)
      setTextUN(un)
      setTextValor(valor)
      setListProducts([])
      setIsDialogCreate(true)
    }
    return (
      list.map((element, key) => {
        return (
          <View key={key} style={{ backgroundColor: '#fff', padding: 10, margin: 5, borderRadius: 5, elevation: 2 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#909090', width: '70%' }}>{element.nome}</Text>
              <Text style={{ fontWeight: 'bold', color: '#909090', fontSize: 16, width: '20%' }}>R$ {element.valor.toFixed(2).replace('.', ',')}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ width: '80%' }}>{element.empresa}</Text>
              <Text style={{ width: '15%' }}>UN: {element.UN}</Text>
            </View>
            <Text style={{ textAlign: 'center', color: '#909090' }}>{stringDate(element.emissao)}</Text>
          </View>
        )
      }
      )
    )
  }
  return (
    <>
    <Surface style={{ flex: 1, backgroundColor: '#fff' }}>
      <Searchbar
        style={{ backgroundColor: '#fff' }}
        placeholder="Buscar produtos em notas"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: 10, marginRight: 10 }}>
        <Text>{region.localidade} / {region.uf}</Text>
        <Button
          icon="map-marker-radius"
          size={20}
          onPress={() => setIsDialogCep(true)}
        >CEP</Button>
      </View>
      <ProgressBar progress={0.5} indeterminate={isProgress} visible={isProgress} />
      <Surface style={{ flex: 2, margin: 10, borderRadius: 5 }}>
        <MenssagemLength data={{ tamanho: listProducts.length, message: 'Nenhum resultado' }} />
        <ScrollView>
          {listLista(listProducts)}
        </ScrollView>

      </Surface>
     
      <Dialog visible={isDialogCep} onDismiss={hidleDialogCep}>
        <Dialog.Content style={{ backgroundColor: '#fff' }}>
          <Subheading style={{ color: '#909090', textAlign: 'center' }}>Informe um CEP válido</Subheading>
          <TextInput
            style={{ backgroundColor: '#FFF' }}
            label='CEP' placeholder='ex: 00000-000' value={cep} onChangeText={setCEP} />

          <Button loading={isLogInCep} style={{ marginTop: 15 }} onPress={() => buscarCEP(cep)}>
            Buscar
                </Button>

          <Text style={{ fontSize: 11, textAlign: 'center' }}>Você pode ir em seu perfil e atualizar seu cadastro</Text>
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
     
    </Surface>
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
</>
  )
}
