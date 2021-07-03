import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import {
  Container,
  Submit,
  Box,
  TabText,
  BoxSubmit,
  BoxRow,
  ListFlat,
} from './style';
//UUID
var uuid = require('react-native-uuid');
import MenssagemLength from '../MenssagemLength';
//
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FAB, Portal, Title, Divider, Subheading, Searchbar, Snackbar, Button, TextInput, Dialog, Surface, List, ProgressBar, Menu, IconButton, Colors } from 'react-native-paper';
//functions 
import { stringDate } from '../bibliotecas_functions'
import getRealm from '../../services/realm';
import { getProducts } from '../../Controller/controller-search'
import { getCadastro } from '../../Controller/ControllerCadastro'
import { getCEP } from '../../Controller/ControllerWebCEP';

export default function ViewLista({ route, navigation }) {

  const [lista, setLista] = useState({ _id: '', id: '', nome: '', items: [] })
  const [textNome, setTextNome] = useState('')
  const [user, setUser] = useState()
  const [region, setRegion] = useState({ localidade: '', uf: '', bairro: '', logradouro: '' });

  const [textUN, setTextUN] = useState('UN')
  const [textQuantidade, setTextQuantidade] = useState(1)
  const [textValor, setTextValor] = useState(1)

  const [textIDedit, setTextIDedit] = useState('')
  const [textNomeEdit, setTextNomeEdit] = useState('')
  const [textUNEdit, setTextUNEdit] = useState('UN')
  const [textQuantidadeEdit, setTextQuantidadeEdit] = useState(1)
  const [textValorEdit, setTextValorEdit] = useState(1)
  const [textInfoEdit, setTextInfoEdit] = useState({})

  const [openFab, setOpenFab] = useState(false)
  const onStateChange = () => setOpenFab(!openFab)

  const [isDialogCreate, setIsDialogCreate] = useState(false)
  const _hidleDialogCreate = () => setIsDialogCreate(!isDialogCreate)

  const [isDialogEdit, setDialogEdit] = useState(false)
  const _hidleDialogEdit = () => setDialogEdit(!isDialogEdit)

  const [visibleSnack, setVisibleSnack] = useState(false)
  const [styleSnack, setStyleSnack] = useState(false)
  const [messageSnack, setMessagerSnack] = useState('')

  const onDismissSnackBar = () => setVisibleSnack(false);
  //cep
  const [isLogInCep, setIslogInCep] = useState(false);
  const [isDialogCep, setIsDialogCep] = useState(false)
  const [localidade, setLocalidade] = useState('')
  const [cep, setCEP] = useState('')
  const hidleDialogCep = () => { setIsDialogCep(false) }
  const onDismissLogInCep = () => setIslogInCep(false);
  //progress
  const [isProgress, setIsProgress] = useState(false)
  const onDismissProgress = () => { setIsProgress(false) }
  const onDismissLogIn = () => setIslogin(false);
  //search
  const hidleDialogSearchProduct = () => {
    onDismissProgress()
    setSearchQuery('')
    setListProducts([])
  }
  const [listProducts, setListProducts] = useState([])
  const [searchProducts, setSearchProdutcs] = useState([])
  const [searchQuery, setSearchQuery] = React.useState('');
  async function cadastroUser(id) {
    try {
      const response = await getCadastro(id)
      return response.data;
    } catch (error) {
      console.log(error)
    }

  }
  const onChangeSearch = async query => {
    setSearchQuery(query)
    if (localidade) {

      await getProducts(query, localidade)
        .then(r => {

          const { data } = r
          onDismissProgress()
          setListProducts(data)
          setSearchProdutcs(data)
        })
        .catch(e => {
          onDismissProgress()
        })
      onDismissProgress()

    } else {
      setIsDialogCep(true)
    }
  };
  //app bar
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  useEffect(() => {
    async function getLista() {

      const realm = await getRealm();
      const _lista = realm.objects('Lista').filtered('id=' + JSON.stringify(route.params))
      const objUser = realm.objects('User')

      setUser(...objUser)
      setLista(..._lista)
      setIsProgress(true)
      await getCadastro(objUser[0]._id)
        .then(r => {
          setIsProgress(false)
          const { localidade, cep } = r.data
          if (r.data) {
            onCEP(cep)
            setLocalidade(localidade)
          }
        })
        .catch(e => {
          setIsProgress(false)
          console.log(e);
        })
    }
    getLista();
  }, []);


  async function onCreate(id, nome, quantidade, un, valor) {
    const realm = await getRealm();

    const total = parseFloat(quantidade) * parseFloat(valor)

    const guid = uuid.v1()
    const string = 'id=' + JSON.stringify(id)
    let _lista = realm.objects('Lista').filtered(string)

    try {
      setTextNome('')
      setTextQuantidade(1)
      setTextUN('UN')
      setTextValor(1)

      realm.write(() => {
        realm.create('Lista', {
          id: _lista[0].id,
          _id: _lista[0]._id,
          updatedAt: new Date(),
        }, 'modified')
        _lista[0].items.push({ id: guid, nome: nome, quantidade: parseFloat(quantidade), UN: un, valor: parseFloat(valor), total: parseFloat(total) })
      })

      onSnack(true, 'Item inserido', true)
    } catch (error) {
      onSnack(true, 'Falha ao inserir, tente novamente!', false)
    }
  }
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessagerSnack(message)
    setStyleSnack(style)
  }
  function openDialogEdit(data) {
    setTextIDedit(data.id)
    setTextNomeEdit(data.nome)
    setTextUNEdit(data.UN)
    setTextQuantidadeEdit(data.quantidade.toFixed(2))
    setTextValorEdit(data.valor.toFixed(2))
    setTextInfoEdit(data);
    setDialogEdit(true)
  }
  function onValor(list) {
    let total = 0;
    list.forEach(element => {
      total += element.total
    })
    return total
  }
  async function onUpdate(id, nome, quantidade, un, valor, user) {
    const realm = await getRealm();
    try {
      realm.write(() => {
        realm.create('Item', {
          id,
          nome,
          quantidade: parseFloat(quantidade),
          UN: un,
          valor: parseFloat(valor),
          total: parseFloat(valor) * parseFloat(quantidade),
          user,
          updatedAt: new Date()
        }, 'modified')
      })
      onSnack(true, 'Item atualizado', true);
    } catch (error) {
      console.log(error)
      onSnack(true, 'Falha ao atualizar', false)
    }
  }
  async function removeRealm(id) {
    console.log(id)
    try {
      const realm = await getRealm();
      let relamObject = realm.objects('Lista').filtered('id=' + JSON.stringify(id))
      let realmDeleted = relamObject[0].items.filtered('select=true')
      realm.write(() => {
        realm.delete(realmDeleted)
      })
    } catch (error) {
      console.log('e', error)
    }

  }
  function onDelete(id) {
    try {
      let listSelectFalse = lista.items.filter(element => !element.select ? element : null)
      setLista({ id: lista.id, _id: lista._id, nome: lista.nome, items: listSelectFalse })
      removeRealm(id)
      onSnack(true, 'Iten(s) deletados', true)
    } catch (error) {
      console.log(error)
      onSnack(true, 'Falha ao deletar', false)
    }
  }
  async function deleteItem(id){
    try {
      const realm = await getRealm();
      let relamObject = realm.objects('Item').filtered('id=' + JSON.stringify(id))
      realm.write(() => {
        realm.delete(relamObject)
        onSnack(true, 'Iten(s) deletados', true)
      })
    } catch (error) {
      console.log('e', error)
    }
  }
  function newObjectItem(oldItem) {
    const { UN, _id, id, nome, quantidade, select, total, updatedAt, user, valor } = oldItem
    return { UN, _id, id, nome, quantidade, select, total, updatedAt, user, valor }
  }
  function ItemLista({ data }) {
    let select = data.select

    async function onAddUnidade(itemSelect, unidade) {
      const element = { id: itemSelect.id, quantidade: itemSelect.quantidade + unidade }
      var newItem = newObjectItem(itemSelect)
      newItem.quantidade += unidade
      newItem.total = (itemSelect.quantidade + unidade) * itemSelect.valor
      const aux = lista.items.map(element => element.id === newItem.id ? newItem : element)
      setLista({ _id: lista._id, id: lista.id, nome: lista.nome, items: aux })
      updateItem(newItem)
    }

    async function updateItem(newObject) {
      const realm = await getRealm()
      realm.write(() => {
        realm.create('Item', newObject, 'modified')
      })
    }
    function onSelected(itemSelect) {
      const { select } = itemSelect
      var newD = newObjectItem(itemSelect)
      newD.select = !select
      const aux = lista.items.map(element => element.id === newD.id ? newD : element)
      setLista({ _id: lista._id, id: lista.id, nome: lista.nome, items: aux })
      updateItem(newD)
    }

    return (
      <View>
        <List.Item

          style={data.select ? { backgroundColor: '#FEAB0D' } : { color: '#fafafa' }}
          title={data.nome}
          description={`${data.UN != 'KG' ? data.quantidade : data.quantidade.toFixed(3)} ${data.UN} Valor R$ ${data.valor.toFixed(2).replace('.', ',')} Total R$ ${data.total.toFixed(2).replace('.', ',')}`}
          right={props =>

            <BoxRow style={{ alignItems: 'center' }}>
              <Submit onPress={() => onAddUnidade(data, 1)} ><Icon name='add' size={20} /></Submit>
              <Submit onPress={() => onAddUnidade(data, -1)}><Icon name='remove' size={20} /></Submit>
              <Submit onPress={() => openDialogEdit(data)} ><Icon name='edit' size={20} /></Submit>
              <Submit onPress={() => deleteItem(data.id)} ><Icon name='delete' size={20} /></Submit>
            </BoxRow>
          }
          onPress={() => { onSelected(data) }}
        />
        <Divider />
      </View>
    )
  }
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
          <View key={key} style={{ backgroundColor: '#fff', borderRadius: 5, elevation: 2 }}>
            <View >
              <Subheading style={{}}>{element.nome}</Subheading>
              <Text style={{}}>{element.empresa}</Text>
              <Text>{stringDate(element.emissao)}</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', borderRadius: 5 }}>
              <Title>R$ {element.valor.toFixed(2).replace('.', ',')}</Title>
              <Button mode='outlined' onPress={() => onInsertItem(element.nome, 1, element.UN, element.valor)}>
                inserir
              </Button>
            </View>
          </View>
        )
      }
      )
    )

  }
  function onCEP(textCEp) {
    setIslogInCep(true)
    getCEP(textCEp)
      .then(r => {
        onDismissLogInCep()
        const { bairro, cep, complemento, ddd, gia, ibge, localidade, logradouro, uf } = r.data
        setLocalidade(localidade)
        setRegion(r.data)
        setIsDialogCep(false)
        setSearchQuery('')
        //  onSnack(true, `Localidade ${localidade} encontrada`, true)
      })
      .catch(e => {
        onDismissLogInCep()
        //  console.log('e', e)
        //  onSnack(true, 'Falha ao buscar, por favor verifique se o cep está digitado corretamente', false)
      })
  }
  function listItemMenu(listas) {
    function filterProdutos(nome) {
      const objectFilter = listas.filter(element => {
        if (element.nome.indexOf(nome) > -1) {
          return element;
        }
      })
      setListProducts(objectFilter)
    }
    return (
      listas.map((element, key) => {
        return (
          <View key={key} style={{ backgroundColor: '#fff' }}>
            <Menu.Item onPress={() => filterProdutos(element.nome)} title={element.nome} />
            <Divider />
          </View>
        )
      })
    )
  }
  return (
    <Surface style={{ flex: 1, }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fc6500' }}>
        <Searchbar
          style={{ backgroundColor: '#fff', width: '100%', elevation: 0 }}
          placeholder="Pesquisar produtos"
          onIconPress={() => { onChangeSearch }}
          onChangeText={onChangeSearch}
          value={searchQuery}
        />

      </View>

      <ProgressBar progress={0.5} indeterminate={isProgress} visible={isProgress} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ marginLeft: 10, color: '#c7c7c7' }}>{region.localidade}/{region.uf}</Text>
        <Menu

          visible={visible}
          onDismiss={closeMenu}
          style={{ backgroundColor: '#fff' }}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={20}
              onPress={openMenu}
            />}>
          <Menu.Item onPress={() => setIsDialogCep(true)} title="CEP" />
        </Menu>
      </View>

      <Surface style={{ flex: 1, margin: 0, borderRadius: 10 }}>
        <View style={{ marginBottom: 0 }}>
          <View style={{ margin: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
            <Title style={{ color: '#909090' }}>{lista.nome}</Title>
            <Title style={{ fontWeight: 'bold', color: '#909090', fontSize: 16 }}>R$ {onValor(lista.items).toFixed(2).replace('.', ',')}</Title>
          </View>
        </View>
        <Surface style={{ margin: 5, borderRadius: 10, flex: 1, backgroundColor: '#fff', elevation: 2 }}>
          <MenssagemLength data={{ tamanho: lista.items.length, message: 'Você não possui itens' }} />
          <ListFlat
            data={lista.items}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => <ItemLista data={item} />}
          />
        </Surface>
      </Surface>
      <FAB.Group
        color={'#fff'}
        visible={true}
        open={openFab}
        icon={openFab ? 'plus' : 'pencil-plus'}
        actions={
          [
            { icon: 'delete-sweep-outline', label: 'Deletar itens selecionados', onPress: () => onDelete(route.params) },
          ]
        }
        onStateChange={onStateChange}
        onPress={() => {
          if (openFab) {
            setIsDialogCreate(true)
          }
        }}
      />
      <Snackbar
        visible={visibleSnack}
        onDismiss={onDismissSnackBar}
        duration={600}
        style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#fcc7c7c7' }}
        action={{
          label: 'Sair',
          onPress: () => {
            onDismissSnackBar
          },
        }}>
        {messageSnack}
      </Snackbar>
      <Dialog visible={isDialogCreate} onDismiss={_hidleDialogCreate}>
        <Dialog.Content>
          <Surface>
            <Subheading>Adicionar um novo item</Subheading>
            <Divider />
            <TextInput
              style={{ marginTop: 20 }}
              label='Nome'
              placeholder='ex:Arroz'
              value={textNome}
              onChangeText={setTextNome} />
            <BoxRow style={{ justifyContent: 'space-between', marginTop: 10 }}>
              <TextInput
                style={{ width: '32%' }}
                label='Quantidade'
                keyboardType="numeric"
                placeholder='ex: 2'
                value={`${textQuantidade}`}
                onChangeText={setTextQuantidade} />
              <TextInput
                style={{ width: '32%' }}
                label='UN'
                placeholder='ex: CX'
                value={textUN}
                onChangeText={setTextUN} />
              <TextInput style={{ width: '32%' }}
                label='Valor R$'
                keyboardType="numeric"
                placeholder='ex: 3.99'
                value={`${textValor}`}
                onChangeText={setTextValor} />
            </BoxRow>
            <Button style={{ marginTop: 10 }} mode='contained'
              onPress={() => onCreate(route.params, textNome, textQuantidade, textUN, textValor)}>
              inserir
            </Button>
          </Surface>
        </Dialog.Content>
      </Dialog>
      <Dialog visible={listProducts.length} onDismiss={hidleDialogSearchProduct}>
        <Dialog.Content style={{ backgroundColor: '#fff' }}>
          <View
            style={{
              marginTop: -15,
              backgroundColor: '#fff',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View></View>
            <MenssagemLength data={{ tamanho: listProducts.length, message: 'Não foi encontrado produtos' }} />
            <Menu
              style={{ backgroundColor: '#c7c7c7', margin: 0, padding: 0 }}
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon="filter"
                  size={20}
                  onPress={openMenu}
                />
              }>
              {listItemMenu(searchProducts)}
            </Menu>

          </View>
          <Divider />
          <ScrollView>
            {listLista(listProducts)}
          </ScrollView>
        </Dialog.Content>
      </Dialog>
      <Dialog visible={isDialogEdit} onDismiss={_hidleDialogEdit}>
        <Dialog.Content>
          <Surface>
            <Subheading>Editar item</Subheading>
            <Divider />
            <TextInput
              style={{ marginTop: 20 }}
              label='Nome'
              placeholder='ex:Arroz'
              value={textNomeEdit}
              onChangeText={setTextNomeEdit} />
            <BoxRow style={{ justifyContent: 'space-between', marginTop: 10 }}>
              <TextInput
                style={{ width: '32%' }}
                label='Quantidade'
                keyboardType="numeric"
                placeholder='ex: 2'
                value={`${textQuantidadeEdit}`}
                onChangeText={setTextQuantidadeEdit} />
              <TextInput
                style={{ width: '32%' }}
                label='UN'
                placeholder='ex: 5kg'
                value={textUNEdit}
                onChangeText={setTextUNEdit} />
              <TextInput style={{ width: '32%' }}
                label='Valor R$'
                keyboardType="numeric"
                placeholder='ex: 3.99'
                value={`${textValorEdit}`}
                onChangeText={setTextValorEdit} />
            </BoxRow>
            <Box style={{ fontSize: 10 }}>
              <Text style={{ fontSize: 10 }}>+ detalhes</Text>
              <Divider />
              <Text style={{ fontSize: 10 }}>{stringDate(textInfoEdit.updatedAt)}, {textInfoEdit.user}</Text>
              <Text style={{ fontSize: 10 }}> total R$ {parseFloat(textInfoEdit.total).toFixed(2)}</Text>
            </Box>

            <Button style={{ marginTop: 10 }} mode='contained'
              onPress={() => onUpdate(textIDedit, textNomeEdit, textQuantidadeEdit, textUNEdit, textValorEdit)}>
              atualizar
            </Button>
          </Surface>
        </Dialog.Content>
      </Dialog>
      <Dialog visible={isDialogCep} onDismiss={hidleDialogCep}>
        <Dialog.Content>
          <Subheading style={{ color: '#909090', textAlign: 'center' }}>Você não informou sua loclaidade</Subheading>
          <TextInput
            style={{ backgroundColor: '#FFF' }}
            label='CEP' placeholder='ex: 00000-000' value={cep} onChangeText={setCEP} />

          <Button loading={isLogInCep} style={{ marginTop: 15 }} mode='outlined' onPress={() => onCEP(cep)}>
            Buscar
          </Button>
          <Divider />
          <Text style={{ fontSize: 11, textAlign: 'center' }}>Você pode ir em seu perfil e atualizar seu cadastro</Text>
        </Dialog.Content>
      </Dialog>
    </Surface>

  )
}
