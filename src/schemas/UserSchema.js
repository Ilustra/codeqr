export default class UserSchema {
  static schema = {
    name: 'User',
    primaryKey: '_id',
    properties: {
      _id: {type: 'string'},
      photoURL:{type:'string', default: ''},
      uid:{type: 'string'},
      name: {type: 'string',  default: ''},
      first_name: {type: 'string', default: ''},
      last_name: {type: 'string', default: ''},
      email: {type: 'string'},
      password: {type: 'string', default: ''},
      token: {type: 'string'},
      provider:{type: 'string', default: 'API-SERVICE'}
    },
  };
}
