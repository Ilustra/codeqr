import Realm from 'realm';

import SchemaUrlsNotas from '../schemas/SchemaUrlsNotas';
import NotasSchema from '../schemas/NotasSchema';
import ProdutoSchema from '../schemas/ProdutoSchema';
import ListaSchema from '../schemas/ListaSchema';
import UserSchema from '../schemas/UserSchema';
import ItemSchema from '../schemas/ItemSchema';
import SchemaMeta from '../schemas/SchemaMeta';
import DespesaSchema from '../schemas/DespesaSchema';


export default function getRealm() {
  return Realm.open({
    schema: [
      SchemaUrlsNotas,
      NotasSchema,
      ProdutoSchema,
      ListaSchema,
      UserSchema,
      ItemSchema,
      SchemaMeta,
      DespesaSchema,
    ],
  });
}
