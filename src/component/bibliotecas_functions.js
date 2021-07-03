//
import NetInfo from '@react-native-community/netinfo';
//recebe uma array de despensa my e others e retorna a despensa mais recente
export function compareDespensa(value) {
  let despensa = value.my;

  while (value.others.length > 0) {
    let aux_despensa = value.others.pop();
    let date1 = new Date(despensa.updatedAt);
    let date2 = new Date(aux_despensa.updatedAt);

    if (date2 > date1) {
      despensa = aux_despensa;
    }
  }
  return despensa;
}
export function stringDiffDate(newDate, oldDate){
  const now = new Date(newDate); // Data de hoje
  const past = new Date(oldDate); // Outra data no passado
  const diff = Math.abs(now.getTime() - past.getTime()); // Subtrai uma data pela outra
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo). 
  const hours = Math.ceil(days / (1000 * 60 * 60)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo). 
  return {
    days: days,
    hours: hours
  }
}
export function stringDateDMA(value){
  let date = new Date(value);
  let string_date =
    date.getUTCDate() +  '/' +  (date.getMonth()+1) +'/'+  date.getFullYear() 
  return string_date;
}
//recebe uma data e retorna ela em uma string
export function stringDate(value) {
  var days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sabádo',
  ];
  var mounth = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  let date = new Date(value);
  let string_date =
    days[date.getDay()] +
    ' ' +
    date.getUTCDate() +
    ' ' +
    mounth[date.getMonth()] +
    ' às ' +
    date.getHours() +
    'h' +
    date.getUTCMinutes();
  return string_date;
}



//verifica se está conectado
export async function onConected() {
  let isconected = false;
  await NetInfo.fetch().then(state => {
    //console.log('Connection type', state.type);
    //console.log('Is connected?', state.isConnected);
    isconected = state.isConnected;
  });
  return isconected;
}
export  function formatarMoeda(valor) {
  valor = valor + '';
  valor = parseInt(valor.replace(/[\D]+/g, ''));
  valor = valor + '';
  valor = valor.replace(/([0-9]{2})$/g, ",$1");

  if (valor.length > 6) {
      valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
  }

  return valor;
}
