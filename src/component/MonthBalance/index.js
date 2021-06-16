import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Portal,
  Dialog,
  FAB,
  TextInput,
  Button,
  Surface,
  ActivityIndicator,
  Divider,
  Title,
  Appbar,
  Snackbar,
  Subheading,
  IconButton
} from 'react-native-paper';
//
import { ListF, BoxRow, TabText, BxDescriptions } from './style';
//
var uuid = require('react-native-uuid');
import { getNotasMonth, getBallance } from '../../Controller/ControllerNotas'
import { stringDate } from '../bibliotecas_functions';
import getRealm from '../../services/realm';
//
import { ExpErr } from '../expecptions'
import MenssagemLength from '../MenssagemLength'
const MONTH = [
  { id: 0, mes: 'Janeiro' },
  { id: 1, mes: 'Fevereiro' },
  { id: 2, mes: 'Março' },
  { id: 3, mes: 'Abril' },
  { id: 4, mes: 'Maio' },
  { id: 5, mes: 'Junho' },
  { id: 6, mes: 'Julho' },
  { id: 7, mes: 'Agosto' },
  { id: 8, mes: 'Setembro' },
  { id: 9, mes: 'Outubro' },
  { id: 10, mes: 'Novembro' },
  { id: 11, mes: 'Dezembro' },
];
var DAYS = [
  'D',
  'S',
  'T',
  'Q',
  'Q',
  'S',
  'S',
];
import { ProgressCircle, LineChart, XAxis, Grid, YAxis } from 'react-native-svg-charts'
//
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import {IDBanner} from '../variaveis'
const adUnitId = IDBanner;


export default function ReportMeta({ navigation }) {
  const [now, setNow] = useState(new Date())

  const [user, setUser] = useState([])
  const [notas, setNotas] = useState([])
  const [meta, setMeta] = useState({ id: "0", mes: 0, valor: 0.00, valorGastro: 0 })
  const [dataGrap, setDataGrap] = useState([])
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

  const [valor, setValor] = useState('');
  const date = new Date();
  const [mes, setMes] = useState(`${date.getMonth()}`);
  const [visibleMeta, setVisibleMeta] = useState();
  const [metas, setMetas] = useState([]);
  const [isVisibleDialogListMeta, setIsVisibleDialogListMeta] = useState(false);
  const onStateChange = () => setOpen(!open);
  const _hideDialogListMeta = () => setIsVisibleDialogListMeta(!isVisibleDialogListMeta);

  function _hideDialog() {
    setVisibleMeta(false);
  }
  function _openDialogCreateMeta() {
    setVisibleMeta(true);
  }
  //
  useEffect(() => {
    async function reloagGet() {
      try {
        const realm = await getRealm();
        const _meta = realm
          .objects('Meta')
          .filtered(`mes=${JSON.stringify(now.getMonth())}`);

        if (_meta.length)
          setMeta(..._meta)
        else
          setMeta({ id: "0", mes: 0, valor: 0.00, valorGastro: 0 })
        const _user = realm.objects('User')

        setUser(..._user)

        const start = new Date(now.getFullYear(), now.getMonth(), 1)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        getNotas(_user[0]._id, start, end)

      } catch (error) {
        console.log('error', error)
      }
    }
    reloagGet();
  }, []);
  const [dayGrap, setDayGrap] = useState([])
  async function getNotas(id, startTime, endTime) {
    setAnimating(true)
    await getNotasMonth(id, startTime, endTime)
      .then(element => {
        const { data } = element
        const list = []
        let _listDay = []
        setNotas(data)
        let i = 1

        data.forEach(e => {
          let day = new Date(e.emissao)
          list.unshift(e.total)
          _listDay.unshift({
            day: day.getUTCDate(),
          })
        })

        setDayGrap(_listDay)
        setDataGrap(list)
        onDismissIndicator()
      })
      .catch(e => {
        onDismissIndicator()
        const { response } = e
        console.log('e', response.data)
        onSnack(true, ExpErr(response.status, response.data), false)
      })
  }
  async function getMeta(mes) {
    try {
      const realm = await getRealm();
      const _meta = realm
        .objects('Meta')
        .filtered(`mes=${JSON.stringify(mes)}`);
      if (_meta.length) {
        setMeta(_meta[0])
      } else {
        setMeta({ id: "0", mes: 0, valor: 0.00, valorGastro: 0 })
      }
    } catch (error) {
      console.log('error', error)
      onSnack(true, 'Ops! algo inesperado aconteceu, tente novamente', false)
    }
  }
  function onValor(_despesas) {
    let valor = 0;
    _despesas.forEach(element => {
      valor += parseFloat(element.total);
    })
    return valor;
  }
  function NextMonth(month) {
    if (month == 11) {
      var current = new Date(now.getFullYear() + 1, 0, 1);
      setNow(current)
    } else {
      var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      setNow(current)
    }
    getMeta(current.getMonth())
    const start = new Date(current.getFullYear(), current.getMonth(), 1)
    const end = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    //console.log('start', start, 'end', end)
    getNotas(user._id, start, end)

  }
  function BackMonth(month) {
    if (month == 0) {
      var current = new Date(now.getFullYear() - 1, 11, 1);
      setNow(current)
    } else {
      var current = new Date(now.getFullYear(), month - 1, 1);
      setNow(current)
    }

    getMeta(current.getMonth())
    // console.log(now.getMonth())
    const start = new Date(current.getFullYear(), current.getMonth(), 1)
    const end = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    console.log('start', start, 'end', end)
    getNotas(user._id, start, end)

  }

  async function onCreate(_valor, _mes) {
    const realm = await getRealm();
    const data = {
      id: uuid.v1(),
      valor: parseFloat(_valor),
      mes: parseInt(_mes),
      valorGastro: 0.0,
    };
    try {
      realm.write(() => {
        realm.create('Meta', data, 'modified');
        onSnack(true, 'Meta definida com sucesso!', true)
      });
      _hideDialog();
    } catch (error) {
      console.log(error)
      onSnack(true, 'Falha ao criar meta', false)
    }
  }

  function onProgress(_meta, _valorGasto) {
    if (_meta > 0) {
      const t = (((_meta - _valorGasto) * 100) / _meta)
      // console.log((100 - t) / 100)
      return t ? (100 - t) / 100 : 0
    }


  }
  function onPorcent(maior, menor) {
    if (maior > 0) {
      const t = (((maior - menor) * 100) / maior)
      return t ? 100 - t : 0
    } else {
      return 0
    }


  }
  function TSTEste(data) {
    return (
      data.map((element, key) => {
        return (
          <Surface key={key}
            style={{ backgroundColor: '#fff', padding: 10, marginTop: 5, borderRadius: 5, elevation: 1 }}>

            <Text style={{ color: '#c7c7c7' }}>{stringDate(element.emissao)}</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#909090' }}>{element.nome}</Text>

            <View style={{ borderRadius: 5, marginRight: 5 }}>
              {element.subTotal > 0 ?
                <BxDescriptions>
                  <Text>SubTotal</Text>
                  <Text> R$ {element.subTotal.toFixed(2).replace('.', ',')}</Text>
                </BxDescriptions> : null}
              {element.descontos > 0 ?
                <BxDescriptions>
                  <Text >Desconto </Text>
                  <Text > - R$ {element.descontos.toFixed(2).replace('.', ',')}</Text>
                </BxDescriptions> : null}

              <BxDescriptions>
                <Text style={{ fontWeight: 'bold' }}>Total </Text>
                <Text style={{ fontWeight: 'bold' }}>R$ {element.total.toFixed(2).replace('.', ',')}</Text>
              </BxDescriptions>

              <Divider />

              <BxDescriptions>
                <Text style={{ color: '#c7c7c7' }}>Tributos pago </Text>
                <Text style={{ color: '#c7c7c7' }}>R$ {element.tributos.toFixed(2).replace('.', ',')}</Text>
              </BxDescriptions>
            </View>
          </Surface>
        )
      })
    )
  }
  function legendDay(data) {
    const lists = data.sort()
    return (
      lists.map((element, key) => {
        return (
          <View key={key}>
          <Text style={{ fontSize: 8, textAlign:'center' }} >Dia </Text>
          <Text style={{ fontSize: 10, textAlign:'center' }}>{element.day}</Text>
          </View>
        )
      }
      )
    )
  }
  return (
    <Surface style={{ flex: 1 }}>


 
      <ScrollView>
        <Surface style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 20,
          margim: 0
        }}>
          <Button onPress={() => { BackMonth(now.getMonth()) }} style={{ fontSize: 30 }} >
            <Icon name='navigate-before' size={30} />
          </Button>
          { animating ?         <ActivityIndicator animating={animating} /> :  <Title style={{ textAlign: 'center' }}>{MONTH[now.getMonth()].mes} {now.getFullYear()}</Title>}
         
          <Button onPress={() => NextMonth(now.getMonth())} style={{ fontSize: 30 }} >
            <Icon size={30} name='navigate-next' />
          </Button>
        </Surface>

        <Surface style={{ flex: 1, elevation: 1, backgroundColor: '#FFF', borderRadius: 10, paddign: 10, margin: 5 }}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Title style={{ color: '#c7c7c7', marginLeft: 5 }}>Detalhes</Title>
            <View style={{flexDirection:'row', alignItems:'center'}}>
            <IconButton icon='chart-line'   onPress={() => navigation.navigate('Relatorio')} color='#000'/>
          <IconButton icon='chart-arc' onPress={() => _openDialogCreateMeta()} color='#000' />
     
            </View>

          </View>


          <Surface style={{ margin: 5, borderRadius: 5, padding: 5, backgroundColor:'#fff' }}>
         
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
              <Text style={{ color: '#16A7F2', fontWeight: 'bold' }}>Total</Text>
              <Subheading style={{ color: '#16A7F2', fontWeight: 'bold' }}> R$ {onValor(notas).toFixed(2)}</Subheading>
            </View>

            {meta.valor ?
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: '#00C441', fontWeight: 'bold' }}>Meta</Text>
                  <Subheading style={{ color: '#00C441', fontWeight: 'bold' }}>R$ {meta.valor.toFixed(2)}</Subheading>
                </View>
                <View>
                  <View style={{}}>
                    <ProgressCircle
                      style={{ height: 70 }}
                      progress={onProgress(meta.valor, onValor(notas).toFixed(2))}
                      progressColor={onProgress(meta.valor, onValor(notas).toFixed(2)) > 0.7 ? '#00C441' : '#16A7F2'}>
                      <Title style={{ textAlign: 'center', color: '#c7c7c7', marginTop: 15, fontSize: 14 }}>{onPorcent(meta.valor, (onValor(notas).toFixed(1))).toFixed(2)}%</Title>
                    </ProgressCircle>
                  </View>

                </View>
              </View>
              : null}
            <View>

            </View>

            <View>
            {dataGrap.length  ?
            <>
             <View style={{ height: 200, flexDirection: 'row' }}>
              <YAxis
                data={dataGrap}
                contentInset={{ top: 20, bottom: 20 }
                }
                svg={{
                  fill: 'grey',
                  fontSize: 10,
                }}
                numberOfTicks={10}
                formatLabel={(value) => `R$ ${value}`}
              />
              <LineChart
                style={{ flex: 1 }}
                data={dataGrap}
                gridMin={0}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
              >
                <Grid />
              </LineChart>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginTop: -15 }}>
              {legendDay(dayGrap)}
            </View>
            </> : null}
           
            </View>
            <Subheading style={{ textAlign: 'center', color: '#c7c7c7' }}>Notas</Subheading>
            {TSTEste(notas)}
            <MenssagemLength show={false} data={{ tamanho: notas.length, message: 'Você não possui notas para esse mês' }} />
          </Surface>
        </Surface>

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

        <Portal>
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
          <FAB.Group
            visible={false}
            open={false}
            color='#fff'
            icon={'plus'}
            size={30}
            actions={[

            ]}
            onStateChange={onStateChange}
            onPress={() => {
              setIsDialogCreateDespesa(true)
            }}
          />
          <Dialog visible={isVisibleDialogListMeta} onDismiss={_hideDialogListMeta}>
            <Dialog.Content>
              <BoxRow style={{
                justifyContent: 'space-between',
                textAlign: 'center',
                marginBottom: 10,
                borderBottomWidth: 1,
                borderColor: '#c7c7c7'
              }}>
                <TabText style={{ width: 80 }}>Mês</TabText>
                <TabText style={{ width: 80 }}>Meta</TabText>
                <TabText style={{ width: 80 }}>Valor gasto</TabText>
              </BoxRow>
              <ListF
                data={metas}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => <ItemMeta data={item} />}
              />
            </Dialog.Content>
          </Dialog>
          <Dialog visible={visibleMeta} onDismiss={_hideDialog}>
            <Dialog.Content>
              <BoxRow
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#c7c7c7',
                  width: 250,
                  marginBottom: 10,
                  justifyContent: 'space-between',
                  marginTop: -10,
                  marginLeft: -10
                }}>
                <Text style={{ color: '#909090' }}>
                  Definir uma meta de gastos
                </Text>
              </BoxRow>
              <BoxRow style={{ alignItems: 'center' }}>
                <Text>Mês: </Text>
                <Picker
                  selectedValue={mes}
                  mode='dropdown'
                  style={{
                    height: 40,
                    width: '80%',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                  onValueChange={(itemValue, itemIndex) =>
                    setMes(itemValue)
                  }>
                  <Picker.Item label="Janeiro" value="0" />
                  <Picker.Item label="Fevereiro" value="1" />
                  <Picker.Item label="Março" value="2" />
                  <Picker.Item label="Abril" value="3" />
                  <Picker.Item label="Maio" value="4" />
                  <Picker.Item label="Junho" value="5" />
                  <Picker.Item label="Julho" value="6" />
                  <Picker.Item label="Agosto" value="7" />
                  <Picker.Item label="Setembo" value="8" />
                  <Picker.Item label="Outubro" value="9" />
                  <Picker.Item label="Novembro" value="10" />
                  <Picker.Item label="Dezembro" value="11" />
                </Picker>
              </BoxRow>
              <TextInput
                label="Valor"
                placeholder='ex: 200'
                value={`${valor}`}
                keyboardType="numeric"
                onChangeText={setValor}
              />
              <Button
                style={{ marginTop: 10, marginBottom: 10 }}
                mode='contained'
                onPress={() => onCreate(valor, mes)}>
                Criar
              </Button>
            </Dialog.Content>
     
          </Dialog>
        </Portal>
     <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
 
      </ScrollView>

    </Surface>
  )
}