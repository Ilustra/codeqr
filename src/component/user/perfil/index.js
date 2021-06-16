import React, { useState, useEffect } from 'react';

import AwesomeAlert from 'react-native-awesome-alerts';

import { View, Text, ScrollView, SafeAreaView, RecyclerViewBackedScrollViewComponent} from 'react-native';
//
import { Button, TextInput, Snackbar, Surface, ProgressBar, Portal, Dialog, Divider } from 'react-native-paper';
import AuthContext from '../../../context/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Body,
  BoxMeusDados,
  BoxTitle,
  Box,
  BoxRow,
} from './style';
//
import getRealm from '../../../services/realm';
import { ExpErr } from '../../expecptions'
import { updateUser } from '../../../Controller/ControllerUser';
import { getCadastro, onCreate, modifyPassword } from '../../../Controller/ControllerCadastro';
import { getCEP } from '../../../Controller/ControllerWebCEP';

export default function Perfil({ route, navigation }) {
  const { signOut } = React.useContext(AuthContext);
  //alerta
  const [onAlert, setOnAlert] = useState(false);
  const [isTitle, setIstitle] = useState('');
  const [isMessage, setIsMessage] = useState('');
  //
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState();
  const [ddd, setDDD] = useState('');
  const [phone, setPhone] = useState('');
  const [localidade, setLocalidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [uf, setUF] = useState('');
  //progress bar
  const [isVisibleProgress, setIsvisibleProgress] = useState(false)
  const onDismissProgress = () => setIsvisibleProgress(false);
  //
  //logIn
  const [isLogin, setIslogin] = useState(false);
  const [isLogInCep, setIslogInCep] = useState(false);
  const onDismissLogInCep = () => setIslogInCep(false);
  const onDismissLogIn = () => setIslogin(false);
  const onLogin = () => setIslogin(true)
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
  //dialog edit password
  const [password, setPassword] = useState('123456')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confNewPassword, setConfNewPassword] = useState('')
  const [isDialogPassword, setIsDialogPassword] = useState(false)
  const hidleDialogPassword =()=>{setIsDialogPassword()}
  //
  useEffect(() => {
    async function getUser() {
      const realm = await getRealm();
      const _user = await realm.objects('User');
      setUser(_user[0]);
      setIsvisibleProgress(true)
      await getCadastro(_user[0]._id)
        .then(r => {
          const { cep, ddd, firstName, lastName, phone, bairro, localidade, uf } = r.data;
          setCep(cep)
          setFirstName(firstName)
          setLastname(lastName)
          setPhone(phone)
          setDDD(ddd)
          setLocalidade(localidade)
          setBairro(bairro)
          setUF(uf)
          onDismissProgress()
        })
        .catch(e => {
          onDismissProgress()
          const { response } = e
          console.log(response.data)
          onSnack(true, ExpErr(response.status, response.data), false)
        })

    }
    getUser();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => exit()} title="Update count" color='#fff'>Sair</Button>
      ),
    });
  }, [navigation]);

  async function onCadastro() {
    onLogin()
    await onCreate(
      user._id,
      firstName,
      lastName,
      email,
      cep,
      ddd,
      phone,
      localidade,
      bairro,
      uf,
    )
      .then(async response => {
        onDismissLogIn()
        onSnack(true, 'Cadastro realizado com sucesso', true)
      })
      .catch(e => {
        onDismissLogIn()
        const { response } = e
        onSnack(true, ExpErr(response.status, response.data), false)
      });

  }
  async function confirmExit() {
    const realm = await getRealm();
    try {
      realm.write(()=>{
        realm.deleteAll()
      })  
      signOut();
    } catch (error) {
      console.log('error deleteAll()', error)
    }
    
   
  }
  async function exit() {
    setOnAlert(true);
    setIstitle('Você tem certeza que deseja sair?');
    setIsMessage('todos os seus dados serão excluidos do aplicativo');
  }

  function onCEP(textCEp) {
    setIslogInCep(true)
    getCEP(textCEp)
      .then(r => {
        const { bairro, cep, complemento, ddd, gia, ibge, localidade, logradouro, uf } = r.data
        setLocalidade(localidade)
        setBairro(bairro)
        setUF(uf)
        onDismissLogInCep()
      })
      .catch(e => {
        onDismissLogInCep()
        console.log('e', e)
        onSnack(true, 'Falha ao buscar, por favor verifique se o cep está digitado corretamente', false)
      })
  }
  async function forgotPasswoord(id, oldPass, newPass, confPass){
    if(oldPass!="" && newPass!=""&& confPass!=""){
      if(!(newPass != confPass)){
        await modifyPassword(id, oldPass, newPass, confPass)
        .then(async r=>{
          console.log(r.data)
          hidleDialogPassword();
          const realm =await getRealm();
          try {
            realm.write(()=>{
              realm.create('User', {_id: user._id, password: newPass}, 'modified');
            })  
          } catch (error) {
            console.log(error)
          }
          console.log(realm.objects('User'))
          onSnack(true, 'Senha atualizada com sucesso', true)
        })
        .catch(e=>{
          console.log(e)
          const {response} = e
          onSnack(true, ExpErr(response.status, response.data), false)
        })
      }else{
        onSnack(true, 'Senhas não confere', false);
      }
    }else{
      onSnack(true, 'Preencha todos os campos', false);
    }
  }
  return (
<SafeAreaView style={{flex: 1}}>

          <ProgressBar visible={isVisibleProgress} indeterminate={isVisibleProgress} progress={0.5} />   

    <ScrollView>
          <Surface style={{ 
            backgroundColor:'#fff', 
            flexDirection:'column', 
            justifyContent:'space-between', padding: 5, flex: 1}}>
          <BoxMeusDados style={{ marginTop: 0 }}>
            <BoxTitle>
              <BoxRow
                style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <BoxRow
                  style={{
                    width: 150,
                  }}>
                  <Icon name="assignment-ind" size={15} color="#909090" />
                  <Text style={{ color: '#909090' }}>Meus dados</Text>
                </BoxRow>
              </BoxRow>
            </BoxTitle>
            <Box>
              <Box style={{ marginBottom: 10 }}>
                <TextInput style={{ backgroundColor: '#FFF' }} label='Nome' value={firstName} onChangeText={setFirstName} />
              </Box>
              <Box style={{ marginBottom: 10 }}>
                <TextInput style={{ backgroundColor: '#FFF' }} label='Sobrenome' value={lastName} onChangeText={setLastname} />
              </Box>
            </Box>
          </BoxMeusDados>
          <BoxMeusDados >
            <BoxTitle style={{ width: 150 }}>
              <BoxRow>
                <Icon name="phone" size={15} color="#909090" />
                <Text style={{ color: '#909090' }}>Telefone</Text>
              </BoxRow>
            </BoxTitle>
            <Box style={{ justifyContent: 'space-between' }}>
              <Box style={{ width: '28%' }}>
                <TextInput style={{ backgroundColor: '#FFF' }} label='DDD' value={ddd} onChangeText={setDDD} />
              </Box>
              <Box style={{ width: '68%' }}>
                <TextInput style={{ backgroundColor: '#FFF' }} label='Telefone' value={phone} onChangeText={setPhone} />
              </Box>
            </Box>
          </BoxMeusDados>
          <BoxMeusDados>
            <BoxTitle style={{ width: 150 }}>
              <BoxRow>
                <Icon name="location-on" color="#909090" size={15} />
                <Text style={{ color: '#909090', marginLeft: 5 }}>Localização</Text>
              </BoxRow>
            </BoxTitle>
            <Box style={{ }}>
              <Box style={{ width: '30%' }}>
                <TextInput
                  style={{ backgroundColor: '#FFF' }}
                  label='CEP' placeholder='ex: 00000-000' value={cep} onChangeText={setCep} />
              </Box>
              <Button style={{marginTop: 15}} loading={isLogInCep} mode='outlined' onPress={() => onCEP(cep)}>
                Buscar
                </Button>
              <TextInput style={{ backgroundColor: '#FFF' }} label='UF' disabled={true} placeholder='ex: PR' value={uf} onChangeText={setUF} />
            </Box>
            <BoxRow style={{ justifyContent: 'space-between' }}>
              <Box style={{ width: '45%' }}>
                <TextInput style={{ backgroundColor: '#FFF' }} label='Cidade' placeholder='Ex: Medianeira' value={localidade} onChangeText={setLocalidade} />
              </Box>
              <Box style={{ width: '45%' }}>
                <TextInput style={{ backgroundColor: '#FFF' }} label='Bairro' placeholder='Ex: Centro' value={bairro} onChangeText={setBairro} />
              </Box>
            </BoxRow>
            <BoxRow>
              <View></View>
            </BoxRow>
          </BoxMeusDados>
          <AlertMessage data={{ title: isTitle, message: isMessage }} />
          <View style={{alignItems:'center'}}>
          <Button
            style={{ width:'45%' }}
            loading={isLogin}
            mode='contained'
            icon="check"
            onPress={() => onCadastro()}>
            Salvar
          </Button>
          </View>
    </Surface>
    </ScrollView>
   <Portal>
      <Dialog visible={isDialogPassword} onDismiss={hidleDialogPassword} style={{padding: 0, margin:0}}>
        <Dialog.Content style={{padding: 0, margin: 0}}>
          <View>
          <Text style={{color: '#c7c7c7', marginLeft: 0, marginTop: -10}}>Alterar senha</Text>
          </View>
          <Divider/>
          <View style={{marginTop: 10}}>
              <TextInput 
              mode='outlined' 
              secureTextEntry={true} label='senha atual'  
              value={oldPassword} 
              onChangeText={setOldPassword} />     
              <TextInput 
              mode='outlined' 
              secureTextEntry={true} label='nova senha' 
              value={newPassword} 
              onChangeText={setNewPassword} />             
              <TextInput 
              mode='outlined' 
              secureTextEntry={true} label='Confirme a senha' 
              value={confNewPassword} 
              onChangeText={setConfNewPassword} />
        
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-between', padding: 5, marginTop: 10}}>
                  <Button style={{width: '45%'}} mode='outlined' onPress={()=>{hidleDialogPassword()}}>Cancelar</Button>
                  <Button style={{width: '45%'}} mode='contained' onPress={()=>{forgotPasswoord( user._id,oldPassword, newPassword, confNewPassword)}}>Enviar</Button>
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
  

</SafeAreaView>
  );

  function AlertMessage({ data }) {
    function hideAlert() {
      setOnAlert(false);
      setIstitle('');
      setIsMessage('');
    }
    return (
      <AwesomeAlert
        show={onAlert}
        style={{ elevation: 3 }}
        showProgress={false}
        title={data.title}
        message={data.message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        showCancelButton={true}
        cancelText="Cancelar"
        confirmText="Confirmar"
        cancelButtonColor="#505050"
        confirmButtonColor="#fc6500"
        onCancelPressed={() => {
          hideAlert();
        }}
        onConfirmPressed={() => {
          confirmExit();
        }}
      />
    );
  }
}
