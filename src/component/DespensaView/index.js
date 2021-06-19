import React, { useEffect, useState } from 'react';
import { Surface, Button, Portal,  IconButton, Dialog, Chip,  Searchbar, Text, TextInput, Snackbar, Title, ActivityIndicator, Divider, List, FAB, Subheading } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Animated, View, Image, addons, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ExpErr } from '../expecptions'
import { ListFlat } from './style'
import { onConected, stringDate, stringDiffDate, stringDateDMA } from '../bibliotecas_functions'
import { onDeleteItem, onUpdateItem, onGetDespensa} from '../../Controller/controller-despensa';
import ListaSchema from '../../schemas/ListaSchema';
import getRealm from '../../services/realm'
import DatePicker from 'react-native-date-picker'
import Despensa from '../../business/Despensa'
const CATEGORIAS = [
    { id: '1', name: 'Geral' },
    { id: '2', name: 'Freezer' },
    { id: '3', name: 'Limpeza' },
    { id: '4', name: 'Higiene' },
    { id: '5', name: 'Bebidas' },
    { id: '6', name: 'Legumes' },
    { id: '7', name: 'Frutas' },
    { id: '8', name: 'Hortifruti' },
]
export default function DespensaView({route}) {
    const [despensa, setDespensa] = useState(new Despensa('', '', '', [], [], '', new Date()))
    const [items, setItems] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState(new Date())
    //indicator
    const [animating, setAnimating] = useState(false)
    const onDismissAnimatind = () => setAnimating(false);
    //dialogedit produto
    const [isDialogEdit, setIsDialogedit] = useState(false)
    const hidleDialogEditProduct = () => setIsDialogedit(false)
    // 

    const [text__id, setTextId] = useState('')
    const [text_status, setTextStatus] = useState('')
    const [text_openDate, setTextOpenDate] = useState('')
    const [text_nivel, setTextNive] = useState('')
    const [text_updatedAt, setTextUpdate] = useState('')
    const [text_name, setTextName] = useState('')
    const [text_UN, setTextUn] = useState('')
    const [text_quantidade, setTextQuantidade] = useState()
    const [text_valor, setTextValor] = useState('')
    const [text_total, setTextTotal] = useState('')
    const [text_validade, setTextValidade] = useState('')
    const [text_updateUser, setTextUpdateUser] = useState('')
    const [text_categoria, setTextCategoria] = useState(CATEGORIAS[0].name)
    const [user, setUser] = useState()

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
    useEffect(() => {
        async function initial() {
            const realm = await getRealm();
            const _user = realm.objects('User')
            setUser(..._user)
            const {despensa} = route.params
            setItems(despensa.items)
            setDespensa(new Despensa(despensa._id, despensa.name, despensa.user, despensa.items, despensa.user_shareds, despensa.userUpdate, despensa.updatedAt));
        }
        initial();
    }, [])
    
    async function updateItem(userId, itemId, status, openDate, nivel, updatedAt, name, UN, quantidade, valor, total, validade, updateUser, categoria) {
        try {

        await onUpdateItem(userId, itemId, status, openDate, 
            nivel, 
            updatedAt, 
            name, 
            UN, 
            quantidade, 
            valor, 
            total,
            validade, 
            updateUser, 
            categoria).then(resp=>{
                 despensa.onItemUpdate(resp.data);
                setItems(despensa.items)
                hidleDialogEditProduct()
            }).catch(e=>{
                const {response} =e;
                console.log(response)
            })
            onSnack(true, "Item atualizado", true)
        } catch (error) {
            setAnimating(false)
            console.log(error.response)
            const { response } = error
            onSnack(true, ExpErr(response.status, response.data), false)   
        }
    }

    function renderPiker(data) {
        return (
            data.map((element, key) => {
                return (<Picker.Item key={key} label={element.name} value={element.name} />)
            })
        )
    }

    function ListCategory({ data }) {
        const { name } = data
        return (
            <Chip style={{}} onPress={() => setItems(despensa.filterCategoria(name))}>{name}</Chip>
        )
    }
       
    async function deletedItem(despensaId, itemId, userId) {
        await onDeleteItem(despensaId, itemId, userId).then(response => {
            despensa.deleteItem(itemId)
            setItems(despensa.items)
            setItems(despensa.items)
            onSnack(true, "Item deleteado", true)
        })
        .catch(error => {
            const { response } = error
            onSnack(true, ExpErr(response.status, response.data), false)
        })
    }

    function onDialogEditProduct(item) {
        setIsDialogedit(true)
        setTextId(item._id)
        setTextStatus(item.status)
        setTextOpenDate(item.openDate)
        setTextNive(item.nivel)
        setTextUpdate(new Date())
        setTextName(item.name)
        setTextUn(item.UN)
        setTextQuantidade(item.quantidade)
        setTextValor(item.valor)
        setTextTotal(item.total)
        setTextValidade(item.validade)
        setTextUpdateUser(item.updateUser)
        setTextCategoria(item.categoria)
        console.log(!item.validade)
        if(item.validade)
        setDate(new Date(item.validade))
    }  
    function ListProducts( value ) {
       return (
           value.map((data, key)=>{
            const diffValidade = stringDiffDate(data.validade, new Date())
            const vencido = new Date(data.validade) < new Date()
            const diffOpen = stringDiffDate(data.openDate, new Date())
            const diffCreated = stringDiffDate(data.createdAt, new Date())
            return (
         
                <Surface key={key} style={{ elevation: 1, backgroundColor: '#fff', margin: 5, borderRadius: 10, padding: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Title style={{ color: '#505050' }}>{data.name}</Title>
                        </View>
                        <View>
                            <Text style={{ color: '#c7c7c7', fontSize: 12 }}>Categoria:</Text>
                            <Text style={{ color: '#9c9c9c', fontSize: 14 }}>{data.categoria}</Text>
                        </View>
                    </View>
                    <Divider />
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 12, color: '#9c9c9c' }}>UN: {data.UN}</Text>
                                <Text style={{ fontSize: 12, color: '#9c9c9c' }}>Valor: {data.valor}</Text>
                                <Text style={{ fontSize: 12, color: '#9c9c9c' }}>Total: {data.total}</Text>
                                <Text style={{ fontSize: 12, color: '#9c9c9c' }}>Usuário: {data.user}</Text>
                                <Text style={{ fontSize: 12, color: '#9c9c9c' }}>Data da Compra: {stringDateDMA(data.createdAt)}</Text>
    
                            </View>
                            <View style={{ flexDirection: 'row', width: '45%', justifyContent: 'space-between' }}>
                                <IconButton style={{ margin: 0, backgroundColor: '#fc6500' }} 
                                onPress={() => updateItem(despensa.user, data._id, true, new Date(), data.nivel, new Date(), data.name, data.UN, data.quantidade-1 < 0 ? 0 : data.quantidade-1, data.valor, data.total, new Date(data.validade), user.name, data.categoria)} icon='minus' color='#ffff' />
                                <Text style={{ color: '#9c9c9c', fontSize: 22, fontWeight: 'bold' }}> {data.UN =='KG' ? data.quantidade.toFixed(3) : data.quantidade}</Text>
                                <IconButton color='#fff' style={{ margin: 0, backgroundColor: '#2FCF23' }} 
                                onPress={() => updateItem(despensa.user, data._id, data.status, new Date(), data.nivel, new Date(), data.name, data.UN, parseFloat(data.quantidade+1), data.valor, data.total, new Date(data.validade), user.name, data.categoria)} icon='plus' />
                            </View>
                        </View>
                    </View>
                    <View style={{}}>
                        <Text style={{ color: '#c7c7c7' }}>Válidade</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {!vencido ?
                         <>
                         <IconButton color={diffValidade.days < 7 ? '#f64a4a' : '#505050'} onPress={() => { console.log('calendary') }} icon='calendar' size={23} />
                            {diffValidade.days ? 
                            <View>
                            <Text style={diffValidade.days < 7 ? { color: '#f64a4a' } : { color: '#505050' }}> faltam {diffValidade.days} dias </Text>
                            <Text style={{ color: '#9c9c9c', fontSize: 10, textAlign: 'center' }}> {stringDateDMA(data.validade)}  </Text>
                        </View>
                            : <Text style={{color:'#c7c7c7'}}>Não informada</Text>}
                         </>  
                           :
                           <>
                           <IconButton color='#f64a4a' onPress={() => { console.log('calendary') }} icon='calendar' size={23} />
                           <View>
                           <Text style={{color:'#f64a4a', fontWeight:'bold'}}>Produto Vencido</Text>
                           <Text style={{ color: '#9c9c9c', fontSize: 10, textAlign: 'center' }}> {stringDateDMA(data.validade)}  </Text>
                           </View>
                           </>
                           }    
                        </View>
                    </View>
                    <Divider />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <IconButton icon='delete' onPress={() => { deletedItem(despensa._id, data._id, user._id) }} size={20} color='#fff' style={{ backgroundColor: '#f64a4a' }} />
                        <IconButton icon='pencil' onPress={() => { onDialogEditProduct(data) }} size={20} color='#fff' style={{ backgroundColor: '#16A7F2' }} />
                        {!data.status ?
                            <Button
                            onPress={() => updateItem(despensa.user, data._id, true, new Date(), data.nivel, new Date(), data.name, data.UN, data.quantidade, data.valor, data.total, new Date(data.validade), user.name, data.categoria)}
                            color='#16A7F2'>Abrir</Button>
                            :
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                    <View style={{ marginTop: 0, marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -15, marginBottom: -10 }}>
                                            <IconButton style={{ margin: 0, padding: 0, }}
                                                icon={data.nivel === 100 ? 'battery' : data.nivel === 0 ? 'battery-outline' : `battery-${data.nivel}`}
                                                color={data.nivel > 80 ? '#2FCF23' : data.nivel >= 40 ? '#f1ba04' : '#f10404'} size={30} />
                                            <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute', color: '#505050', fontWeight: 'bold', fontSize: 10 }}>{data.nivel}%</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 12, color: '#9c9c9c' }}>Existe um produto aberto</Text>
                                            <Text style={{ fontSize: 12, color: '#c7c7c7', textAlign: 'center' }}>{diffOpen.days > 1 ? 'à ' + diffOpen.days + ' dias': null} </Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        }
                    </View>
                    <Divider />
                    <Text style={{ fontSize: 12, color: '#505050', textAlign: 'center' }}>atualizado: {data.updateUser} {stringDate(data.updatedAt)}</Text>
                </Surface>
            )
           })
       )
        
    }
    const onChangeSearch = async (query) => {
        console.log('query',query)
        setSearchQuery(query)
        const list = despensa.items.filter(element=>{
            if(element.name.toUpperCase().indexOf(query.toUpperCase())> -1){
                return element
            }
        })
        console.log('list',list)
        setItems(list)
      };
    return (
        <>
        <Searchbar
            style={{ backgroundColor: '#fff' }}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
        />
        <Surface style={{ flex: 1, paddingLeft: 10, paddingRight: 10}}>
            <ActivityIndicator animating={animating} />
            <Text style={{ color: '#c7c7c7' }}>Categorias</Text>
            <View style={{ height: 30 }}>   
                <ListFlat
                    horizontal={true}
                    data={CATEGORIAS}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <ListCategory data={item} />}
                />
            </View>

           <ScrollView>
            {ListProducts(items)}
           </ScrollView>
      
            <Portal>
                <Dialog visible={isDialogEdit} onDismiss={hidleDialogEditProduct} style={{ backgroundColor: '#fff' }}>
                    <Dialog.Content>
                        <TextInput
                            style={{ backgroundColor: '#fff' }}
                            label="Nome"
                            mode='outlined'
                            value={text_name}
                            onChangeText={setTextName}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TextInput
                                style={{ backgroundColor: '#fff', width: '20%' }}
                                label="UN"
                                mode='outlined'
                                value={text_UN}
                                onChangeText={setTextUn}
                            />
                            <TextInput
                                style={{ backgroundColor: '#fff', width: '35%' }}
                                label="quantidade"
                                mode='outlined'
                                value={`${text_quantidade}`}
                                onChangeText={setTextQuantidade}
                            />
                            <TextInput
                                style={{ backgroundColor: '#fff', width: '35%' }}
                                label="Valor"
                                mode='outlined'
                                value={`${text_valor}`}
                                onChangeText={setTextValor}
                            />
                        </View>
                        <View>
                            <Text style={{color: '#c7c7c7', textAlign:'center'}}>Validade</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <DatePicker
                            date={date}
                            mode='date'
                            locale='pt-br'
                            onDateChange={setDate}
                            />
                        </View>
                    
                        <Text style={{ color: '#c7c7c7', marginTop: 10 }}>Status</Text>
                        <Divider />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton style={{ margin: -5 }} onPress={() => { setTextStatus(!text_status) }} icon={text_status ? 'toggle-switch' : 'toggle-switch-off'} color={text_status ? '#00C441' : '#505050'} size={32} />
                            <Text style={{ color: '#c7c7c7' }}>{text_status ? `Aberto` : 'Fechado'}</Text>
                        </View>
                        <Text style={{ color: '#c7c7c7', marginTop: 10 }}>Categoria</Text>
                        <Divider />
                        <Picker
                            selectedValue={text_categoria}
                            mode='contained'
                            onValueChange={(itemValue, itemIndex) =>
                                setTextCategoria(itemValue)
                            }>
                            {renderPiker(CATEGORIAS)}
                        </Picker>
                        <View style={{ margin: 10 }}>
                        </View>
                        <Button loading={animating} onPress={() => updateItem(despensa.user, text__id, text_status, new Date(), text_nivel, new Date(), text_name, text_UN, text_quantidade, text_valor, text_total, date, user.name, text_categoria)} mode='contained'>Atualizar</Button>
                    </Dialog.Content>
                </Dialog>
            </Portal>
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
        </>
    )
}