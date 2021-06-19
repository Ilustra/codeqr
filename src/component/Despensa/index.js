import React, { useEffect, useState } from 'react';
import { Surface, Button, Portal, Avatar, IconButton, Dialog, Chip, RadioButton, TouchableRipple, Text, TextInput, Paragraph, Snackbar, Title, ActivityIndicator, Card, Divider, List, FAB, Subheading } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Animated, View, Image, addons, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ExpErr } from '../expecptions'
import { ListFlat } from './style'
import { onConected, stringDate, stringDateDMA, stringDiffDate } from '../bibliotecas_functions'
import { onCreateDespensa, onGetDespensa, onUpdateItem, onDeleteDespensa, onAddUserShare, onDeleteUserShare } from '../../Controller/controller-despensa'
import { onUser } from '../../Controller/ControllerUser'
import getRealm from '../../services/realm';
import Despensa from '../../business/Despensa'

export default function Dashbard({ navigation }) {

    const [user, setUser] = useState({ _id: 'a' });
    const [email, setEmail] = useState();
    const [shareUser, setShareUser] = useState();
    const [checked, setChecked] = useState('first');
    const [text_status, setTextStatus] = useState(false)
    const [quantidadeUpdate, setQuantidadeUpdate] = useState();

    //state conexão com wifi
    const [isConnected, setIsConnected] = useState(false)
    const [despensas, setDespensas] = useState([])
    const [despensa, setDespensa] = useState(new Despensa('', '', '', [], [], '', new Date()))
    //dialog create new depsensa
    const [deltedDespensa, setDeletedDespensa] = useState(false)
    const [isDialogDeleteDespensa, setDialogDeleteDespensa] = useState(false)
    const hidleDialogDeleteDespensa = () => { setDialogDeleteDespensa(false) }
    const [visibleDialogCreateDespensa, setDialogCreateDespensa] = useState(false)
    const hidleDialogCreateDespensa = () => setDialogCreateDespensa(false)
    //
    const [nameDespensa, setNameDespensa] = useState('')
    //
    const [isDialogDetailProduto, setIsDialogDetailProduto] = useState(false)
    const [detailProduct, setDetailProduct] = useState({})
    const hidleDialogDetaisProduto = () => setIsDialogDetailProduto(false)
    //
    const [isDialogAddShared, setIsDialogAddShared] = useState(false)
    const hidleDialogSharedUSer = () => setIsDialogAddShared(false)
    //
    //indicator
    const [animating, setAnimating] = useState(false)
    const onDismissIndicator = () => setAnimating(false);
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
    //
    const [openUserShared, setOpenUserShared] = useState({ name: '' })
    const [dialogUserShared, setDialogUserShared] = useState(false)
    const hidleDialogUserShare = () => setDialogUserShared(false);

    useEffect(() => {
        async function initializaion() {
            try {
                setAnimating(true)
                const _isconnected = await onConected()
                const realm = await getRealm();
                const _user = realm.objects('User')
                setUser(_user[0]);

                setIsConnected(_isconnected)

                await onGetDespensa(_user[0]._id)
                    .then(response => {
                        onDismissIndicator()
                        const { data } = response
                        console.log(data[0].user_shareds)
                        if (data) {
                            setDespensas(data)
                            setDespensa(new Despensa(data[0]._id, data[0].name, data[0].user, data[0].items, data[0].user_shareds, data[0].userUpdate, data[0].updatedAt))
                        }
                    })
                    .catch(error => {
                        onDismissIndicator()
                        const { response } = error
                        onSnack(true, ExpErr(response.status, response.data), false)
                    })
            } catch (error) {
                console.log(error)
            }

        }
        initializaion();
    }, [])
    async function getUser(email) {
        await onUser(email).then(response => {
            const { data } = response
            console.log(data)
            setShareUser(data);
        })
            .catch(error => {
                const { response } = error
                onSnack(true, ExpErr(response.status, response.data), false)
            })
    }

    async function createDespensa(user, name) {
        await onCreateDespensa(user, name)
            .then(response => {
                const { data } = response
                let list = despensas
                list.push(data)
                setDespensa(new Despensa(data._id, data.name, data.user, data.items, data.user_shareds, data.userUpdate, data.updatedAt));
                setDespensas(list)
                hidleDialogCreateDespensa()
            })
            .catch(error => {
                const { response } = error
                onSnack(true, ExpErr(response.status, response.data), false)
            })
    }

    function onOpenDialogSharedUser(user) {
        setOpenUserShared(user)
        setDialogUserShared(true)
    }

    async function onUpdate(userId, itemId, status, openDate, nivel, updatedAt, name, UN, quantidade, valor, total, validade, updateUser, categoria) {
        setAnimating(true)
        await onUpdateItem(userId, itemId, status, openDate, nivel, updatedAt, name, UN, quantidade, valor, total, validade, updateUser, categoria)
            .then(response => {
                setAnimating(false)
                const { data } = response
                despensa.onItemUpdate(data)
                setDespensa(despensa)
            })
            .catch(error => {
                setAnimating(false)
                const { response } = error
                onSnack(true, ExpErr(response.status, response.data), false)
            })
    }
    function ListProductOpen({ data }) {
        const { _id, status, name, quantidade, nivel, validade, UN } = data
        //console.log('ListProdutoOpen',data)
        function openDialogProduto(item) {
            setIsDialogDetailProduto(true)
            setDetailProduct(item);
            setQuantidadeUpdate(item.quantidade)
        }

        return (
            <Surface style={{ elevation: 2, margin: 5, padding: 5, width: '30%', justifyContent: 'space-between', flexDirection: 'column', backgroundColor: '#fff', borderRadius: 5 }}>
                <View>
                    <Text style={{ color: '#505050' }}>{name.slice(0, 20)}</Text>
                    <Divider />
                </View>

                <View style={{}}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -15, marginBottom: -10 }}>

                        <IconButton onPress={() => openDialogProduto(data)} style={{ margin: 0, padding: 0, }}
                            icon={nivel === 100 ? 'battery' : nivel === 0 ? 'battery-outline' : `battery-${nivel}`}
                            color={nivel >= 80 ? '#2FCF23' : nivel >= 40 ? '#f1ba04' : '#f10404'} size={60} />
                        <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute', color: '#505050', fontWeight: 'bold', fontSize: 10 }}>{nivel}%</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <IconButton style={{ margin: 0 }}
                            onPress={() => onUpdate(despensa.user, data._id, data.status, new Date(), data.nivel + 10 >= 100 ? 100 : data.nivel + 10, new Date(), data.name, data.UN, data.quantidade, data.valor, data.total, data.validade, user.name, data.categoria)}
                            icon='plus' color='#c7c7c7' />
                        <IconButton style={{ margin: 0 }}
                            onPress={() => onUpdate(despensa.user, data._id, data.status, new Date(), data.nivel - 10 <= 0 ? 0 : data.nivel - 10, new Date(), data.name, data.UN, data.quantidade, data.valor, data.total, data.validade, user.name, data.categoria)}
                            icon='minus' color='#c7c7c7' />
                    </View>

                    {status ?
                        <Text style={{ color: '#505050', fontSize: 12 }}> + {UN == 'KG' ? quantidade.toFixed(3) : quantidade - 1 + ` fechado(s)`} </Text>
                        :
                        <Text style={{ color: '#505050', fontSize: 12 }}> {UN == 'KG' ? quantidade.toFixed(3) : quantidade + ` fechado(s)`} </Text>
                    }

                    <Text style={{ color: '#c7c7c7' }}>{data.user}</Text>

                    {validade ?

                        stringDiffDate(new Date(), validade).days < 28 ?
                            <>
                                <Text style={{ color: '#c7c7c7' }}>Validade: {stringDiffDate(new Date(), validade).days} dias</Text>

                            </>
                            :
                            <Text style={{ color: '#c7c7c7' }}>{stringDateDMA(validade)}</Text>
                        :
                        null
                    }
                </View>
            </Surface>
        )
    }

    function ListDespensa({ data }) {
        const { name } = data

        return (
            <Chip style={{ margin: 5 }} onPress={() => setDespensa(new Despensa(data._id, data.name, data.user, data.items, data.user_shareds, data.userUpdate, data.updatedAt))} onLongPress={() => setDialogDeleteDespensa(true)}>{name}</Chip>
        )
    }
    async function deleteDespensa() {
        hidleDialogDeleteDespensa()
        const deleted = await despensa.deleteDespensa(user._id)
        const t = despensas.filter(element => {
            if (element._id != despensa._id) {
                return element;
            }
        })
        setDespensas(t);
    }
    function ListUsersShared({ data }) {
        const { name } = data
        console.log(data)
        if (user._id == despensa.user) {
            return (
                <Chip style={{ margin: 5 }} onPress={() => onOpenDialogSharedUser(data)} >{name}</Chip>
            )
        } else {
            return (
                <Chip style={{ margin: 5 }} >{name}</Chip>
            )
        }
    }
    function onNavigate(_despensa, items) {
        const despensa = {
            _id: _despensa._id,
            user: _despensa.user,
            items: items
        }
        navigation.navigate('DespensaView', { despensa })
    }
    async function addUserShared(despensaId, userId, name) {
        //despensa.addShareUser(shareUser.nome)
        await onAddUserShare(userId, name, despensaId).then(r => {
            const { data } = r
            console.log('add', data)
            despensa.addShareUser(data)
            setDespensa(despensa)
        })
            .catch(error => {
                const { response } = error
                onSnack(true, ExpErr(response.status, response.data), false)
            })
    }
    async function deleteShreUser(despensaId, userId) {
        await onDeleteUserShare(despensaId, userId).then(response => {
            const { data } = response
            despensa.deleteUserShared(userId)
            setDespensa(despensa)
            onSnack(true, 'Usuário deleteado', true)
        }).catch(error => {
            const { response } = error
            onSnack(true, ExpErr(response.status, response.data), false)
        })
    }
    return (
        <Surface style={{ flex: 1, padding: 10 }}>
            <ActivityIndicator animating={animating} />
            {isConnected ?
                <>
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <ListFlat
                                horizontal={true}
                                data={despensas}
                                keyExtractor={item => String(item._id)}
                                renderItem={({ item }) => <ListDespensa data={item} />}
                            />
                            <IconButton icon='plus' onPress={() => setDialogCreateDespensa(true)} />
                        </View>
                    </View>
                    <View style={{}}>
                        <Text style={{ marginLeft: 10, color: '#c7c7c7' }}>Usuários</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <ListFlat
                                horizontal={true}
                                data={despensa.user_shareds}
                                keyExtractor={item => String(item._id)}
                                renderItem={({ item }) => <ListUsersShared data={item} />}
                            />
                            {despensa.user == user._id ?
                                <IconButton icon='plus' onPress={() => setIsDialogAddShared(true)} />
                                : <></>}
                        </View>
                    </View>

                    <Text style={{ color: '#c7c7c7' }}>Info</Text>
                    <Surface style={{ elevation: 2, padding: 10, margin: 5, borderRadius: 10, backgroundColor: '#fff' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{}}>
                                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                <View>
                                     <Text style={{ color: '#505050' }}>Total:  {despensa.items.length}</Text>
                                     <Text style={{ color: '#505050' }}>Produtos abertos: {despensa.open().length} </Text>
                                </View>
                                   <IconButton
                                    icon="window-open"
                                    size={30}
                                     style={{ backgroundColor: '#fc6500' }}
                                     color='#fff'
                                      onPress={() => navigation.navigate('DespensaView', { despensa })}
                                  />
                                </View>
                             

                                {despensa.userUpdate ? <Text style={{ color: '#303030', fontSize: 12 }}>Última atualização: {despensa.userUpdate} {stringDate(despensa.updatedAt)}</Text>
                                    : null}
                            </View>
                
                        </View>
                    </Surface>
                    <Text style={{ color: '#c7c7c7' }}>+detalhes</Text>
                    <Surface style={{ elevation: 1, backgroundColor: '#fff', margin: 5, padding: 10, borderRadius: 10, elevation: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Em falta: {despensa.zerados().length}</Text>
                            <IconButton icon='eye' onPress={() => { onNavigate(despensa, despensa.zerados()) }} style={{ margin: -5 }} />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text>Próximos ao vencimento: {despensa.validade().length}</Text>
                            <IconButton icon='eye' onPress={() => { onNavigate(despensa, despensa.validade()) }} style={{ margin: -5 }} />
                        </View>
                    </Surface>
                    <Surface style={{flex: 1}}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Text style={{ color: '#c7c7c7' }}>{text_status ? 'Produtos abertos' : 'Produtos Fechados'}</Text>
                            <IconButton style={{ margin: -5 }} onPress={() => { setTextStatus(!text_status) }} icon={text_status ? 'toggle-switch' : 'toggle-switch-off'} color={text_status ? '#00C441' : '#505050'} size={32} />

                        </View>


                        <ListFlat
                            numColumns={3}
                            data={text_status ? despensa.open() : despensa.closed()}
                            keyExtractor={item => String(item._id)}
                            renderItem={({ item }) => <ListProductOpen data={item} />}
                        />
                    </Surface>
                </>
                :
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 2 }}>
                    <Icon name='signal-wifi-off' size={43} />
                    <Text>Sem conexão</Text>
                </View>
            }
            <Portal>
                <Dialog visible={visibleDialogCreateDespensa} onDismiss={hidleDialogCreateDespensa}>
                    <Dialog.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Subheading>Criar despensa</Subheading>
                            <IconButton
                                icon="close"
                                size={20}
                                onPress={() => hidleDialogCreateDespensa()}
                            />
                        </View>
                        <View style={{ marginBottom: 10, marginTop: 10 }}>
                            <TextInput
                                label="Nome"
                                mode='outlined'
                                value={nameDespensa}
                                onChangeText={setNameDespensa}
                            />
                        </View>
                        <Button onPress={() => createDespensa(user._id, nameDespensa)} mode='contained'>Criar</Button>
                        <Divider />
                    </Dialog.Content>

                </Dialog>
                <Dialog visible={isDialogDetailProduto} onDismiss={hidleDialogDetaisProduto} >
                    <Dialog.Content>
                        <Text>Detalhes produto</Text>
                        <Divider />
                        <View style={{ padding: 5 }}>
                            <TextInput
                                label="Nome"
                                mode='outlined'
                                color='#fff'
                                value={detailProduct.name}
                                onChangeText={setNameDespensa}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -5, marginBottom: -5 }}>
                                    <IconButton onPress={() => openDialogProduto(data)} style={{ margin: 0, padding: 0, }}
                                        icon={detailProduct.nivel === 100 ? 'battery' : detailProduct.nivel === 0 ? 'battery-outline' : `battery-${detailProduct.nivel}`}
                                        color={detailProduct.nivel > 80 ? '#2FCF23' : detailProduct.nivel >= 40 ? '#f1ba04' : '#f10404'} size={60} />
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', position: 'absolute', color: '#505050', fontWeight: 'bold', fontSize: 10 }}>{detailProduct.nivel}%</Text>
                                </View>
                                <Text style={{ color: '#c7c7c7', fontSize: 18 }}>+</Text>
                                <TextInput
                                    style={{ width: '25%' }}
                                    label="Qtd"
                                    mode='outlined'
                                    value={`${quantidadeUpdate}`}
                                    onChangeText={setQuantidadeUpdate}
                                />

                                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'space-between' }}>

                                    <IconButton color='#fff' style={{ margin: 0, backgroundColor: '#2FCF23' }}
                                        onPress={() => onUpdate(despensa.user, detailProduct._id, detailProduct.status, new Date(), detailProduct.nivel, new Date(), detailProduct.name, detailProduct.UN, quantidadeUpdate, detailProduct.valor, detailProduct.total, detailProduct.validade, user.name, detailProduct.categoria)}
                                        icon='update' />
                                </View>
                            </View>
                            <View>
                                <Text style={{ color: '#505050' }}>+detalhes</Text>
                                <Divider />
                                <Surface style={{ margin: 2, elevation: 1, backgroundColor: '#fff', padding: 5, borderRadius: 5 }}>
                                    <Text style={{ color: '#505050' }}>Próprietário</Text>
                                    <Divider />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <IconButton icon='account-circle' size={30} color='#c7c7c7' />
                                        <View >
                                            <Text style={{ color: '#505050' }}>{detailProduct.user}</Text>
                                            <Text style={{ color: '#505050' }}>{stringDate(detailProduct.createdAt)}</Text>
                                        </View>
                                    </View>
                                </Surface>
                                <Surface style={{ margin: 2, elevation: 1, backgroundColor: '#fff', padding: 5, borderRadius: 5 }}>
                                    <Text style={{ color: '#505050' }}>Atualização</Text>
                                    <Divider />
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <IconButton icon='account-clock' size={30} color='#c7c7c7' />
                                        <View>
                                            <Text style={{ color: '#505050' }}> {detailProduct.updateUser} </Text>
                                            <Text style={{ color: '#505050' }}> {stringDate(detailProduct.updatedAt)}</Text>
                                        </View>
                                    </View>

                                </Surface>

                                {detailProduct.validade ?
                                    <Surface style={{ margin: 2, elevation: 1, backgroundColor: '#fff', padding: 5, borderRadius: 5 }}>
                                        <Text style={{ color: '#505050' }}>válidade</Text>
                                        <Divider />
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <IconButton icon='calendar-clock' size={30} color='#c7c7c7' />
                                            <View>
                                                <Text style={{ color: '#505050' }}>{stringDate(detailProduct.validade)}</Text>
                                            </View>
                                        </View>
                                    </Surface>
                                    : null}
                            </View>
                            <Button
                                onPress={() => onUpdate(despensa.user, detailProduct._id, false, new Date(), 0, new Date(), detailProduct.name, detailProduct.UN, 0, detailProduct.valor, detailProduct.total, detailProduct.validade, user.name, detailProduct.categoria)}
                            >Produto esgotado</Button>
                            {detailProduct.quantidade > 0 && !detailProduct.status ?
                                <Button
                                    onPress={() => onUpdate(despensa.user, detailProduct._id, true, new Date(), 100, new Date(), detailProduct.name, detailProduct.UN, detailProduct.quantidade == 1 ? 1 : detailProduct.quantidade - 1, detailProduct.valor, detailProduct.total, detailProduct.validade, user.name, detailProduct.categoria)}
                                >abrir produto</Button>
                                : null}
                        </View>
                    </Dialog.Content>
                </Dialog>
                <Dialog visible={isDialogAddShared} onDismiss={hidleDialogSharedUSer}>
                    <Dialog.Content>
                        <Text>Adicionar usuário</Text>
                        <View style={{ marginBottom: 10, marginTop: 10 }}>
                            <TextInput
                                label="e-mail"
                                mode='outlined'
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                        <Button loading={animating} onPress={() => getUser(email)}>Buscar</Button>
                        {shareUser ?
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <IconButton onPress={() => addUserShared(despensa._id, shareUser._id, shareUser.nome)} icon='plus' style={{ backgroundColor: '#fc6500' }} />
                                <Text>{shareUser.nome}</Text>
                            </View> : null
                        }
                    </Dialog.Content>

                </Dialog>
                <Dialog visible={dialogUserShared} onDismiss={hidleDialogUserShare}>
                    <Dialog.Content>
                        <Text style={{ textAlign: 'center', fontSize: 16 }}>{openUserShared.name}</Text>
                        <Button onPress={() => deleteShreUser(despensa._id, openUserShared.user)}>deletar</Button>
                    </Dialog.Content>
                </Dialog>
                <Dialog visible={isDialogDeleteDespensa} onDismiss={hidleDialogDeleteDespensa}>
                    <Dialog.Content>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: '#505050' }}>Deseja deseletar a despensa</Text>
                        <Text style={{ textAlign: 'center', fontSize: 16, color: '#505050' }}>{despensa.name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button onPress={() => { deleteDespensa() }}>Confimar</Button>
                            <Button onPress={() => hidleDialogDeleteDespensa()}>Cancelar</Button>
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
        </Surface>
    )
}