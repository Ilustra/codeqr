import React, { Component, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Button, Surface, List, ActivityIndicator, Colors, Divider, Title, Portal, ProgressBar, Snackbar, Subheading } from 'react-native-paper';
//
import { ListF, BxDescriptions, TxYear, Txt } from './style';
//
import { getNotasMonth } from '../../Controller/ControllerNotas'
import { getBallance } from '../../Controller/controller-ballance'
import { stringDate } from '../bibliotecas_functions';
import getRealm from '../../services/realm';
//
import { formatarMoeda } from '../bibliotecas_functions'
import { ExpErr } from '../expecptions'
import MenssagemLength from '../MenssagemLength'
const MONTH = [
    { id: 0, mes: 'Janeiro', sig: 'JAN' },
    { id: 1, mes: 'Fevereiro', sig: 'FEV' },
    { id: 2, mes: 'Março', sig: 'MAR' },
    { id: 3, mes: 'Abril', sig: 'ABR' },
    { id: 4, mes: 'Maio', sig: 'MAI' },
    { id: 5, mes: 'Junho', sig: 'JUN' },
    { id: 6, mes: 'Julho', sig: 'JUL' },
    { id: 7, mes: 'Agosto', sig: 'AGO' },
    { id: 8, mes: 'Setembro', sig: 'SET' },
    { id: 9, mes: 'Outubro', sig: 'OUT' },
    { id: 10, mes: 'Novembro', sig: 'NOV' },
    { id: 11, mes: 'Dezembro', sig: 'DEZ' },
];
//
import { LineChart, YAxis, XAxis, Grid, PieChart } from 'react-native-svg-charts'
import { Text } from 'react-native-svg';
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import { InterstitialAd, AdEventType } from '@react-native-firebase/admob';
import { IDBanner, IDintersiial } from '../variaveis'
const adUnitId = IDBanner;
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';

const interstitial = InterstitialAd.createForAdRequest(IDintersiial, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
});


export default function ReportMeta({ navigation }) {
    const [stores, setStores] = useState([0,0,0,0])
    const contentInset = { top: 20, bottom: 20 }
    const [now, setNow] = useState(new Date())
    const [dataGrap, setDataGrap] = useState([])
    const [ballance, setBallance] = useState({ notas: 0, itens: 0, tributos: 0, total: 0 })

    const [notas, setNotas] = useState([]);
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
    //indicator
    const [animating, setAnimating] = useState(false)
    const onDismissIndicator = () => setAnimating(false);
    //


    useEffect(() => {
        async function reloagGet() {
            try {
                const realm = await getRealm();
                const _user = realm.objects('User')
                const start = new Date(1, 1, now.getFullYear())
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                getNotas(_user[0]._id, start, end)

            } catch (error) {
                const { response } = error
                console.log('error', error)
                onSnack(true, ExpErr(response.status, response.data), false)
            }
        }
        reloagGet();
    }, []);


    function separaNota(aux_value) {
        let aux = [];
        let ts = notas;
        aux_value.forEach(res => {
            const filterT = aux.filter(element => {
                if (element.cnpj == res.cnpj)
                    return element;
            })
            if (filterT.length) {
                const newT = {
                    nome: filterT[0].nome,
                    cnpj: filterT[0].cnpj,
                    total: filterT[0].total += res.total,
                }
                aux = aux.map(e => e.cnpj == newT.cnpj ? newT : e);
            } else {
                aux.push({ nome: res.nome, cnpj: res.cnpj, total: res.total })
            }
        })
        setStores(aux);
        console.log(aux)
    }

    async function getNotas(id, startTime, endTime) {
        setAnimating(true)
        await getNotasMonth(id, startTime, endTime)
            .then(element => {
                const { data } = element
                const now = new Date();
                let balanco =
                {
                    notas: 0,
                    itens: 0,
                    total: 0,
                    tributos: 0
                }

                let listMonth = [
                    {
                        _id: 0,
                        month: 0,
                        total: 0,
                        tributos: 0
                    },
                    {
                        _id: 1,
                        month: 1,
                        total: 0,
                        tributos: 0
                    },
                    {
                        _id: 2,
                        month: 2,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 3,
                        month: 3,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 4,
                        month: 4,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 5,
                        month: 5,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 6,
                        month: 6,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 7,
                        month: 7,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 8,
                        month: 8,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 9,
                        month: 9,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 10,
                        month: 10,
                        total: 0,
                        tributos: 0
                    }, {
                        _id: 11,
                        month: 11,
                        total: 0,
                        tributos: 0
                    }
                ]


                data.forEach(element => {
                    balanco.notas += 1;
                    balanco.itens += element.itens;
                    balanco.total += element.total;
                    balanco.tributos += element.tributos;

                    const date = new Date(element.emissao);

                    switch (date.getMonth()) {
                        case 0: {
                            listMonth[0].total += element.total
                            listMonth[0].tributos += element.tributos
                            break;
                        }
                        case 1: {
                            listMonth[1].total += element.total
                            listMonth[1].tributos += element.tributos
                            break;
                        }
                        case 2: {
                            listMonth[2].total += element.total
                            listMonth[2].tributos += element.tributos
                            break;
                        }
                        case 3: {
                            listMonth[3].total += element.total
                            listMonth[3].tributos += element.tributos
                            break;
                        } case 4: {
                            listMonth[4].total += element.total
                            listMonth[4].tributos += element.tributos
                            break;
                        } case 5: {
                            listMonth[5].total += element.total
                            listMonth[5].tributos += element.tributos
                            break;
                        } case 6: {
                            listMonth[6].total += element.total
                            listMonth[6].tributos += element.tributos
                            break;
                        } case 7: {
                            listMonth[7].total += element.total
                            listMonth[7].tributos += element.tributos
                            break;
                        } case 8: {
                            listMonth[8].total += element.total
                            listMonth[8].tributos += element.tributos
                            break;
                        } case 9: {
                            listMonth[9].total += element.total
                            listMonth[9].tributos += element.tributos
                            break;
                        } case 10: {
                            listMonth[10].total += element.total
                            listMonth[10].tributos += element.tributos
                            break;
                        } case 11: {
                            listMonth[11].total += element.total
                            listMonth[11].tributos += element.tributos
                            break;
                        }
                        default:
                            break;
                    }
                })
                setBallance(balanco)
                onDismissIndicator()
                setDataGrap(listMonth)
                setNotas(data);
                separaNota(data);
            })
            .catch(e => {
                onDismissIndicator()
                //const { response } = e
                //console.log('e', response.data)
                onSnack(true, ExpErr(response.status, response.data), false)
            })
    }

    function ItemMonths(data) {
        return data.map((element, key) => {
            if (element.total > 0) {
                return (

                    <Surface key={key} style={{ backgroundColor: '#fff', margin: 2, borderRadius: 5, elevation: 3, padding: 5 }}>
                        <View style={{ borderRadius: 5, backgroundColor: '#fff', marginLeft: 10, marginRight: 10 }}>
                            <BxDescriptions style={{ alignItems: 'center', paddingRight: 5, paddingLeft: 5 }}>
                                <Subheading style={{ fontWeight: 'bold', color: '#909090', fontSize: 18 }}>{MONTH[element.month].mes}</Subheading>
                                <Subheading style={{ color: '#909090', fontWeight: 'bold', fontSize: 18 }}> R$ {formatarMoeda(element.total.toFixed(2))}</Subheading>
                            </BxDescriptions>
                            <BxDescriptions style={{ marginLeft: 15, marginRight: 15 }}>
                                <Txt style={{ color: '#909090', fontSize: 12 }}>Tributos R$ {element.tributos.toFixed(2).replace('.', ',')}</Txt>
                            </BxDescriptions>

                        </View>
                    </Surface>
                )
            } else {
                return (
                    null
                )
            }

        });
    }

    function listDescription(data) {
        return (
            data.map((elem, key) => {
                return (
                    <View key={key}>
                        <Txt style={{ fontSize: 8 }}>{MONTH[elem.month].sig}</Txt>
                    </View>
                )
            }
            )
        )
    }

    const data = stores
    const [store, setStore] = useState()
    const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

    const Label = ({ slices }) => {
        return slices.map((slice, key) => {
            const { data, pieCentroid } = slice
            console.log(data)
            return (
                <Text
                    key={key}
                    x={pieCentroid[0]}
                    y={pieCentroid[1]}
                    fill='black'
                    textAnchor={'middle'}
                    alignmentBaseLine={'midle'}
                    fontSize={12}
                > {((data.value * 100) / ballance.total).toFixed(2)}%</Text>

            )
        })
    }

    const pieData = data
        .map((element, key) => (
            {
                value: element.total,
                svg: {
                    fill: randomColor(),
                    onPress: () => setStore(element),
                },
                key: `pie-${key}`,
            }))
    function listStores() {
        return stores.map((element, key) => {
            if(element.total> 0){
                return (
                    <Surface key={key} style={{ margin: 5, elevation: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
                        <TxYear>{element.nome}</TxYear>
                        <TxYear>R$ {formatarMoeda(parseFloat(element.total).toFixed(2))}</TxYear>
                    </Surface>
                )
            }
            else
            return null
        }
        )
    }
    return (
        <Surface style={{ flex: 1, }}>
            <ActivityIndicator animating={animating} />
            <ScrollView>
                {stores.length>0 ?
                    <>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <PieChart style={{ height: 250 }} data={pieData}>
                                <Label />
                            </PieChart>
                        </View>
                        <View style={{marginTop: 10, marginBottom: 10}}>
                        <BannerAd
                            unitId={adUnitId}
                            size={BannerAdSize.FULL_BANNER}
                            requestOptions={{
                                requestNonPersonalizedAdsOnly: true,
                            }}
                        />
                        </View>
                        {listStores()}
                    </>
                    : null}
                <Surface style={{ borderRadius: 5, }} >
                    <Surface style={{ margin: 10, elevation: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
                        <BxDescriptions>
                            <TxYear>Notas:</TxYear>
                            <TxYear>{ballance.notas}</TxYear>
                        </BxDescriptions>
                        <Divider />
                        <BxDescriptions>
                            <TxYear>Itens:</TxYear>
                            <TxYear>{ballance.itens}</TxYear>
                        </BxDescriptions>
                        <Divider />
                        <BxDescriptions>
                            <TxYear>Total: </TxYear>
                            <TxYear>R$ {formatarMoeda(ballance.total.toFixed(2))}</TxYear>
                        </BxDescriptions>
                        <Divider />
                        <BxDescriptions>
                            <TxYear>Tributos: </TxYear>
                            <TxYear>R$ {formatarMoeda(ballance.tributos.toFixed(2))}</TxYear>
                        </BxDescriptions>
                    </Surface>
                </Surface>
                <View>
                    <View style={{ height: 200, flexDirection: 'row' }}>
                        <YAxis
                            data={dataGrap}
                            contentInset={contentInset}
                            svg={{
                                fill: 'grey',
                                fontSize: 10,
                            }}
                            numberOfTicks={10}
                            yAccessor={({ item }) => item.total}
                            formatLabel={(valor, month) => `R$ ${valor}`}
                        />
                        <LineChart
                            style={{ flex: 1, marginLeft: 16 }}
                            data={dataGrap}
                            yAccessor={({ item }) => item.total}
                            svg={{ stroke: '#fc6500' }}
                            contentInset={contentInset}
                        >
                            <Grid />
                        </LineChart>
                    </View>
                    <BxDescriptions style={{ marginLeft: 40 }}>
                        {listDescription(dataGrap)}
                    </BxDescriptions>
                </View>
                <Surface style={{ marginTop: 10, padding: 2, borderRadius: 10, flex: 1 }}>
                    {ItemMonths(dataGrap)}
                </Surface>
                <Snackbar
                    visible={visibleSnack}
                    style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#f64a4a' }}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: 'Sair',
                        onPress: () => { onDismissSnackBar() }
                    }}>
                    <Txt style={{ color: '#fff', textAlign: 'center' }}>
                        {messageSnack}
                    </Txt>
                </Snackbar>
            </ScrollView>
        </Surface>
    )
}