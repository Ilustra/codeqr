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
// retorna um item com a quantidade atualizada

export function unidadeDespensa(nome_user, unidade, element) {
  const QUANTIDADE = element.quantidade + unidade;
  const item = {
    _id: element._id,
    id: element.id,
    nome: element.nome,
    quantidade: QUANTIDADE,
    UN: element.UN,
    user: nome_user,
    updatedAt: new Date(),
  };
  return item;
}
//  insere um elemento atualizado na lista
export function newList(item, list) {
  const aux_lista = [];

  list.forEach(element => {
    if (element._id == item._id) {
      aux_lista.push(item);
    } else {
      aux_lista.push(element);
    }
  });

  return aux_lista;
}

export function compareListBy_id(list1, list2) {
  //
  let lista = [];
  //
  while (list1.length > 0) {
    let item = list1.pop();
    const produto = list2.filter(function(aux) {
      if (aux._id == item._id) {
        return aux;
      } else {
        lista.push(aux);
      }
    });
    if (produto[0]) {
      const newItem = compareItem(item, produto[0]);
      lista.push(newItem);
    } else {
      lista.push(item);
    }
  }
  return lista;
}
export function compareListByid(list1, list2, nome_user) {
  var aux_list = [];
  while (list1.length > 0) {
    let item = list1.pop();
    let produto = list2.filter(function(element) {
      if (element.id == item.id) {
        return element;
      }
    });
    if (produto[0]) {
      const QUANTIDADE = item.quantidade + produto[0].quantidade;
      const newItem = {
        _id: produto[0]._id,
        id: produto[0].id,
        nome: produto[0].nome,
        quantidade: QUANTIDADE,
        UN: produto[0].UN,
        user: nome_user,
        updatedAt: new Date(),
      };
      aux_list.push(newItem);
    } else {
      const newItem = {
        _id: item._id,
        id: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        UN: item.UN,
        user: nome_user,
        updatedAt: new Date(),
      };
      aux_list.push(newItem);
    }
  }

  aux_list.forEach(element => {
    list2 = list2.filter(function(aux) {
      if (aux.id != element.id) {
        return aux;
      }
    });
  });
  list2.forEach(element => {
    aux_list.push(element);
  });
  return aux_list;
}

export function returnNewQuantidade(item1, item2, name_user) {
  const QUANTIDADE = parseInt(item1.quantidade) + parseInt(item2.quantidade);
  const newItem = {
    _id: item1._id,
    id: item1.id,
    nome: item1.nome,
    quantidade: QUANTIDADE,
    UN: item1.UN,
    user: name_user,
    updatedAt: new Date(),
  };
  return newItem;
}
// compara data entre dois item e retorna com a data mais recente
export function compareItem(item1, item2) {
  let date1 = new Date(item1.updatedAt);
  let date2 = new Date(item2.updatedAt);
  if (date1 >= date2) {
    return item1;
  } else {
    return item2;
  }
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
