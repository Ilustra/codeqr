
import React, { useEffect, useState } from 'react';
import { Surface, Button, Portal, IconButton, Dialog, Snackbar, Avatar, Title, ActivityIndicator, Colors, Divider, List, FAB, Subheading } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Text, Animated, View, Image, addons } from 'react-native';
import { ProgressCircle, LineChart, XAxis, Grid, YAxis } from 'react-native-svg-charts'
//
import {formatarMoeda} from '../bibliotecas_functions'
import { ExpErr } from '../expecptions'
import getRealm from '../../services/realm';
import Icon from 'react-native-vector-icons/MaterialIcons';
//style
import {
  Submit,
  ListF,
  Container
} from './style';
//componenentes
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
import { useNavigation } from '@react-navigation/native';
import MenssagemLength from '../MenssagemLength'
import { getNotasMonth, getBallance } from '../../Controller/ControllerNotas'
export default function Grap({ translateY }) {
  const [animating, setAnimating] = useState(false)
  const navigation = useNavigation();
  const [now, setNow] = useState(new Date())
  const [meta, setMeta] = useState({ id: "0", mes: 0, valor: 0.00, valorGastro: 0 })
  const [notas, setNotas] = useState([])
  const onDismissIndicator = () => setAnimating(false);
  const [user, setUser] = useState();
  const [dataGrap, setDataGrap] = useState([])
  const [dayGrap, setDayGrap] = useState([])

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
    reloagGet()
  }, []);
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
      getBetweenNotas(_user[0]._id, start, end)

    } catch (error) {
      console.log('error', error)
    }
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
    getBetweenNotas(user._id, start, end)

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
  function legendDay(data) {

    const lists = data.sort()
    return (
      lists.map((element, key) => {
        return (
          <View key={key}>
            <Text style={{ fontSize: 8, textAlign: 'center' }} >Dia </Text>
            <Text style={{ fontSize: 10, textAlign: 'center' }}>{element.day}</Text>
          </View>
        )
      }
      )
    )
  }
  function onValor(_despesas) {
    let valor = 0;
    _despesas.forEach(element => {
      valor += parseFloat(element.total);
    })
    return valor.toFixed(2);
  }
  function BackMonth(month, value) {
    if (month == 0) {
      var current = new Date(now.getFullYear() - 1, 11, 1);
      setNow(current)
    } else {
      var current = new Date(now.getFullYear(), month - 1, 1);
      setNow(current)
    }

    getMeta(current.getMonth())
    const start = new Date(current.getFullYear(), current.getMonth(), 1)
    const end = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    getBetweenNotas(user._id, start, end)

  }

  async function getBetweenNotas(id, startTime, endTime) {
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

        setAnimating(false)
      })
      .catch(e => {
        setAnimating(false)
        onDismissIndicator()
        const { response } = e
        if (response.status == 404) {
          setLogado(false)
        }
        onSnack(true, ExpErr(response.status, response.data), false)
      })
  }
  function ItemNota({ data }) {
    const { nome, total } = data
    return (
      <List.Item title={nome} description={`R$: ${total}`} />
    )
  }
  return (
    <Container style={{
      justifyContent:'center',
      flex: 3,
      transform: [{
        translateY: translateY.interpolate({
          inputRange: [0, 380],
          outputRange: [0, -35],
          extrapolate: 'clamp',
        }),
      }],
      opacity: translateY.interpolate({
        inputRange: [0, 380],
        outputRange: [0, 0.9],
        extrapolate: 'clamp',
      }),
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
        margim: 0
      }}>
        <Button onPress={() => { BackMonth(now.getMonth()) }} style={{ fontSize: 30 }} >
          <Icon name='navigate-before' size={30} />
        </Button>
        {animating ? <ActivityIndicator animating={animating} /> : <Title style={{ textAlign: 'center' }}>{MONTH[now.getMonth()].mes} {now.getFullYear()}</Title>}
        <Button onPress={() => NextMonth(now.getMonth())} style={{ fontSize: 30 }} >
          <Icon size={30} name='navigate-next' />
        </Button>
      </View>

      <Subheading style={{ color: '#fc6500', fontWeight: 'bold', textAlign: 'center' }}> R$ {formatarMoeda(onValor(notas))}</Subheading>
      {dataGrap.length ?
        <View style={{ marginRight: 10, marginLeft: 10 }}>
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
              svg={{ stroke: 'rgb(252, 101, 0)' }}
            >
              <Grid />
            </LineChart>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 30, marginTop: -15 }}>
            {legendDay(dayGrap)}
          </View>
          {notas.length > 0 ?
          <>
          <Divider/>
            <List.AccordionGroup>
              <List.Accordion title="Notas" description={notas.length} id="1">
                <View style={{height:250 }}>
                  <ListF
                    data={notas}
                    style={{ marginTop: 0 }}
                    keyExtractor={item => String(item._id)}
                    renderItem={({ item }) => <ItemNota data={item} />}
                  />
                </View>
              </List.Accordion>
            </List.AccordionGroup>
            </>
            : 
           null
            }
        </View>
        :
       null
      }
      <MenssagemLength data={{ tamanho: notas.length, message: 'Você ainda não possui lançamentos para este mês' }} />
    </Container>

  )
}