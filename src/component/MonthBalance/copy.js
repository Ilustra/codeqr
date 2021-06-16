/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';

import { Text, Picker, StatusBar, View } from 'react-native';
import {
  List, Divider, Title, Menu, FAB,
  Portal,
  Provider,
  Button,
  TextInput,
  Dialog,
  Snackbar,
  DefaultTheme,
  Appbar,
  Surface
} from 'react-native-paper';
var uuid = require('react-native-uuid');
import {
  TabVaor,
  TabDescription,
  TabText,
  Box,
  BoxRow,
  ListF,
} from './style';
//
import Icon from 'react-native-vector-icons/MaterialIcons';
//
import MenssagemLength from '../MenssagemLength';

import getRealm from '../../services/realm';
//
import { stringDate } from '../bibliotecas_functions';
import { getNotasMonth } from '../../Controller/ControllerNotas'
import {ExpErr} from '../expecptions'
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#fc6500',
    accent: '#000',

  },
};
const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

export default function MonthBalance({ navigation }) {
  const date = new Date();
  const [notas, setNotas] = useState([]);
  const [isProgress, setIsprogress] = useState(0.0);
  const [despesas, setDespesas] = useState([]);
  const [valorGasto, SetValorGasto] = useState(0);
  const [meta, setMeta] = useState({ id: '', mes: '0', valor: 0 });
  const [metas, setMetas] = useState([]);
  const [open, setOpen] = useState();
  const [visibleMeta, setVisibleMeta] = useState();
  console.log(date.getMonth())
  const [mes, setMes] = useState(`${date.getMonth()}`);
  const [valor, setValor] = useState('');

  const [isVisibleDialogListMeta, setIsVisibleDialogListMeta] = useState(false);
  const [isDialogCreateDespesa, setIsDialogCreateDespesa] = useState(false);
  //
  const [visibleSnack, setVisibleSnack] = useState(false)
  const [styleSnack, setStyleSnack] = useState(false)
  const [messageSnack, setMessagerSnack] = useState('')

  const onDismissSnackBar = () => setVisibleSnack(false);

  //lanaçamento de despesa
  const [textDescricao, setTextDescricao] = useState()
  const [textValor, setTextValor] = useState('')
  const [textDia, setTextDia] = useState(date.getDay())
  const [textMes, setTextMes] = useState(date.getMonth())
  const [textAno, setTextAno] = useState(date.getFullYear())

  const hideDialogCreateDespesa = () => setIsDialogCreateDespesa(false);


  useEffect(() => {
    async function reloagGet() {

      try {
        const realm = await getRealm();

        const now = new Date();
        const startTime = new Date(date.getFullYear(), date.getMonth(), 1);
        const endTime = now;
  
        const _user = realm.objects('User')

        await getNotasMonth(_user[0]._id, startTime, now)
        .then(element => {
          setDespesas(element.data)
        })
        .catch(e => {
          const {response} = e
          console.log('monthBalance', e.error)
          onSnack(true, ExpErr(response.status, response.data), false)
        })


        const _meta = realm
        .objects('Meta')
        .filtered(`mes=${JSON.stringify(date.getMonth())}`);
      if (_meta.length) {
        setMeta(_meta[0])
      }
      } catch (error) {
        console.log('monthbalance', error)
        onSnack(true, 'Ops! algo inesperado aconteceu, tente novamente mais tarde', false)
      }

    }
    reloagGet();
  }, []);

  function onValor(_despesas) {

    let valor = 0;

    _despesas.forEach(element => {
      valor += parseFloat(element.total);
    })

    const t = valor / meta.valor

    return valor;
  }
  //
  async function getMeta() {
    const date = new Date();
    const realm = await getRealm();
    const metaAux = realm
      .objects('Meta')
      .filtered(`mes=${JSON.stringify(date.getMonth())}`);

    if (metaAux.length > 0) {
      setMeta(metaAux[0]);
    }
  }
  //papeper
  const onStateChange = () => setOpen(!open);
  const _hideDialogListMeta = () => setIsVisibleDialogListMeta(!isVisibleDialogListMeta);

  function _hideDialog() {
    setVisibleMeta(false);
  }
  function _openDialogCreateMeta() {
    setVisibleMeta(true);
  }
  function stringMesAtual() {
    var mounth = [
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
    return mounth[new Date().getMonth()];
  }
  async function onCreate() {
    const realm = await getRealm();
    const mesAux = stringMesAtual();
    const data = {
      id: uuid.v1(),
      valor: parseFloat(valor),
      mes: parseInt(mes),
      valorGastro: 0.0,
    };
    try {
      realm.write(() => {
        realm.create('Meta', data, 'modified');
        onSnack(true, 'Falha ao criar meta', true)
      });
      _hideDialog();
      getMeta();
    } catch (error) {
      onSnack(true, 'Falha ao criar meta', false)
    }

  }

  async function onListedGoal() {
    setIsVisibleDialogListMeta(true)
    const realm = await getRealm();
    const _metas = realm
      .objects('Meta').sorted('mes');
    setMetas(_metas)
  }

  function ItemMeta({ data }) {
    var mounth = [
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
    const mes = mounth[data.mes];
    return (
      <BoxRow style={{ justifyContent: 'space-between', }}>
        <TabText style={{ width: 80 }}>{mes.mes}</TabText>
        <TabText style={{ width: 80 }}>R$ {data.valor}</TabText>
        <TabText style={{ width: 80 }} >R$ {data.valorGasto}</TabText>
      </BoxRow>

    );
  }

  async function onCreateLancamento(descricao, categoria, valor, dia, mes, ano) {
    const realm = await getRealm();
    const despesa = {
      id: uuid.v1(),
      descricao,
      categoria,
      valor: parseFloat(valor),
      updatedAt: new Date(ano, mes, dia)
    }

    try {
      realm.write(() => {
        realm.create('Despesa', despesa)
        setTextValor('');
        setTextDescricao('')
      })
      onSnack(true, 'Despesa criada', true)
    } catch (error) {
      onSnack(true, 'falha ao criar despesa', false)
    }

  }
  function onSnack(status, message, style) {
    setVisibleSnack(status);
    setMessagerSnack(message)
    setStyleSnack(style)
  }
  function RenderLista({ data }) {
    const {
      _id,
      nome,
      tributos,
      subTotal,
      descontos,
      itens,
      pagamento,
      total,
      emissao,
      createdAt
    } = data
    return (
      <>
        <List.AccordionGroup>
          <List.Accordion id={_id} title={'R$: ' + total + ' '} description={stringDate(emissao)} >

            <View style={{ backgroundColor: '#fff', padding: 5 }}>
              <Text style={{textAlign:'center'}}>{nome}</Text>
            
            <Surface style={{ margin: 5, borderRadius: 5, padding: 5}}>
            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between'}}>
              <View style={{marginBottom: 5}}>
                <Text>subtotal: R$ {subTotal}</Text>
                <Text>descontos: R$ {descontos}</Text>
                <Text>Total: R$ {total}</Text>
                <Text>Qtd itens: {itens}</Text>
              </View>
              <View>
                <Text>Dinheiro R$ {pagamento[0].dinheiro}</Text>
                <Text>Crédito R$ {pagamento[0].cartaoCredito}</Text>
                <Text>Debito R${pagamento[0].cartaoDebito}</Text>
              </View>
           
              </View>
              <Button mode='outlined' onPress={() => navigation.navigate('DetalheNota', { data })}>Abrir</Button>
            </Surface>
              
            </View>
          </List.Accordion>
        </List.AccordionGroup>
        <Divider />
      </>
    )
  }

  return (
    <Surface style={{ marginTop: StatusBar.currentHeight, flex: 1 }} >
      <Appbar.Header>
        <Appbar.Content title="" />
        <Button onPress={() => _openDialogCreateMeta()} color='#fff'>Nova meta</Button>
        <Button onPress={() => navigation.navigate('Relatorio')} color='#fff'>Relatório</Button>
      </Appbar.Header>

      <Surface style={{ elevation: 1, flex: 1, backgroundColor: '#fff', padding: 5, margin: 10, borderRadius: 10 }}>
        <BoxRow
          style={{
            justifyContent: 'space-between',
            margin: 5,
            backgroundColor: '#fff',
          }}>
          <Box style={{}}>
            <TabDescription style={{ color: '#c7c7c7' }}>
              Valor gasto:
            </TabDescription>
            <TabVaor style={{ color: '#F27D16' }}>
              R$ {onValor(despesas).toFixed(2)}
            </TabVaor>
          </Box>
          <Box style={{}}>
            <TabDescription style={{ color: '#c7c7c7' }}>
              Saldo:
            </TabDescription>
            <TabVaor style={{ color: '#16A7F2' }}>
              R$ {(meta.valor - onValor(despesas)).toFixed(2)}
            </TabVaor>
          </Box>
          <Box style={{}}>
            <TabDescription style={{ color: '#c7c7c7' }}>Meta:</TabDescription>
            <TabVaor style={{ color: '#00C441' }}>R$ {meta.valor.toFixed(2)}</TabVaor>

          </Box>
        </BoxRow>


      </Surface>


      <Surface style={{ flex: 7, margin: 10, elevation: 1, borderRadius: 10, backgroundColor: '#fff' }}>

        <Title style={{ textAlign: 'center', color: '#c7c7c7', fontSize: 14 }}>Lançamentos para {stringMesAtual().mes}</Title>

        <MenssagemLength
          data={{
            message: 'Você não possui lançamentos.',
            tamanho: despesas.length,
          }}
        />

        <ListF
          data={despesas}
          keyExtractor={item => String(item._id)}
          renderItem={({ item }) => <RenderLista data={item} />}
        />
      </Surface>


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
              onPress={() => onCreate()}>
              Criar
                    </Button>
          </Dialog.Content>
        </Dialog>
        <Dialog visible={isDialogCreateDespesa} onDismiss={hideDialogCreateDespesa}>
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
                Lançar gastos
                </Text>
            </BoxRow>
            <TextInput style={{ marginTop: 10 }}
              label="Descrição"
              placeholder='ex: mercado Super'
              value={textDescricao}
              onChangeText={setTextDescricao}
            />
            <TextInput style={{ marginTop: 10 }}
              label="Valor gasto"
              placeholder='ex: 34.00'
              value={`${textValor}`}
              keyboardType="numeric"
              onChangeText={setTextValor}
            />
            <BoxRow style={{ justifyContent: 'space-between', marginTop: 10 }}>
              <TextInput style={{ width: '32%' }}
                label="Dia"
                placeholder='ex: 15'
                value={`${textDia}`}
                keyboardType="numeric"
                onChangeText={setTextDia}
              />
              <TextInput style={{ width: '32%' }}
                label="Mês"
                placeholder='ex: 02'
                value={`${textMes}`}
                keyboardType="numeric"
                onChangeText={setTextMes}
              />
              <TextInput
                style={{ width: '32%' }}
                label="Ano"
                placeholder='ex: 2020'
                value={`${textAno}`}
                keyboardType="numeric"
                onChangeText={setTextAno}
              />
            </BoxRow>
            <Button
              style={{ marginTop: 10, marginBottom: 10 }}
              mode='contained'
              onPress={() => onCreateLancamento(textDescricao, '', textValor, textDia, textMes, textAno)}>
              Lançar
                    </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </Surface>

  );
}
