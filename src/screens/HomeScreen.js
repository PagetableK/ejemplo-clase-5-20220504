import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Alert, Modal, Pressable, FlatList, Image } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';

const HomeScreen = ({ logueado, setLogueado }) => {
  let ip = `10.10.1.15`;
  const url = `http://${ip}/coffeeshop-master/api/services/admin/administrador.php?action=`;

  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, onChangeNombre] = React.useState('');
  const [apellido, onChangeApellido] = React.useState('');
  const [correo, onChangeCorreo] = React.useState('');
  const [alias, onChangeAlias] = React.useState('');
  const [clave, onChangeClave] = React.useState('');
  const [admins, setAdmins] = useState([]);


  useEffect(() => {
    getAdmins();
  }, []);

  const getAdmins = async () => {
    const urlReadAdmins = url + 'readAll';

    const fetchApi = await fetch(urlReadAdmins, {
      method: 'GET'
    })

    const datos = await fetchApi.json();
    if (datos.status) {
      console.log(datos.dataset);
      setAdmins(datos.dataset);
    } else {
      console.log('u');
    }
  }

  const handleLogOut = async () => {

    //Realizar la petición http 
    const urlLogOut = url += 'action=logOut';

    const fetchApi = await fetch(urlLogOut, {
      method: 'POST'
    })

    const datos = await fetchApi.json();
    if (datos.status) {
      setLogueado(!logueado)
    }
    else {
      console.log(datos);
      // Alert the user about the error
      Alert.alert('Error sesion', datos.error);
    }
  }

  const agregarAdmin = async() =>{
    if(nombre.trim() == '' || apellido.trim() == '' || correo.trim() == '' || alias.trim() == '' || clave.trim() == ''){
      alert('Asegúrese de ingresar todos los campos');
    } else if(!correo.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      alert('El correo ingresado no es válido');
    } else{
      alert('nice');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.textoLabel}>Nombre</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeNombre}
                value={nombre}
                placeholder="Nombre del administrador"
              />
              <Text style={styles.textoLabel}>Apellido</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeApellido}
                value={apellido}
                placeholder="Apellido del administrador"
              />
              <Text style={styles.textoLabel}>Correo</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeCorreo}
                value={correo}
                placeholder="Correo del administrador"
              />
              <Text style={styles.textoLabel}>Alias</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeAlias}
                value={alias}
                placeholder="Alias del administrador"
              />
              <Text style={styles.textoLabel}>Clave</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChangeClave}
                value={clave}
                placeholder="Clave del administrador"
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                // onPress={() => setModalVisible(!modalVisible)}
                onPress={() => agregarAdmin()}
                >
                <Text style={styles.textStyle}>Agregar administrador</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.textoBoton}>
            Agregar administrador
          </Text>
        </Pressable>
      </View>
      <View style={styles.container2}>
        <FlatList
          data={admins}
          horizontal={false}
          renderItem={({ item }) => (
            <View>
              <View style={styles.espacio}></View>
              <View style={styles.cardContainer}>
                <Text style={styles.textoInfo}>Nombre: {item.nombre_administrador} {item.apellido_administrador}</Text>
                <Text style={styles.textoInfo}>Correo: {item.correo_administrador}</Text>
                <Text style={styles.textoInfo}>Alias: {item.alias_administrador}</Text>
                <View style={styles.botonesAcciones}>
                  <Pressable style={{backgroundColor: '#28a745', borderRadius: 20, padding: 5}}>
                    <Image style={styles.imageEdit}
                      source={require('../images/lapiz.png')} />
                  </Pressable>
                  <Pressable style={{backgroundColor: '#dc3545', borderRadius: 20, padding: 5}}>
                    <Image style={styles.imageEdit}
                      source={require('../images/contenedor-de-basura.png')} />
                  </Pressable>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'red',
    alignItems: 'flex-start'
  },
  espacio: {
    height: 10,
  },
  textoInfo: {
    fontWeight: 700,
    fontSize: 15,
  },
  imageEdit: {
    width: 50,
    height: 50
  },
  botonesAcciones:{
    display:'flex',
    flexDirection: 'row',
    gap: 5,
  }, 
  textoLabel:{
    textAlign: 'left'
  },
  container1: {
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    width: Dimensions.get('window').width,
  },
  flatList: {
    flex: 1,
    backgroundColor: 'blue',
    width: Dimensions.get('window').width,
    gap: 200,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    margin: 20,
  },
  button: {
    backgroundColor: '#007bff',
    width: 300,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textoBoton: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: 'white'
  }, centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: '',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 20
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    width: 270,
    alignSelf: 'center',
  },
  cardContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    width: 400,
    height: 200,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    alignSelf: 'center',
    gap: 20,
  }
});



export default HomeScreen;
