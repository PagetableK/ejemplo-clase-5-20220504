import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Alert, Modal, Pressable, FlatList, Image } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';

const HomeScreen = ({ logueado, setLogueado }) => {
  let ip = `192.168.1.3`;
  const url = `http://${ip}/coffeeshop-master/api/services/admin/administrador.php?action=`;

  const [modalVisible, setModalVisible] = useState(false);
  const [idAdmin, setIdAdmin] = useState(0);
  const [nombre, onChangeNombre] = React.useState('');
  const [apellido, onChangeApellido] = React.useState('');
  const [correo, onChangeCorreo] = React.useState('');
  const [alias, onChangeAlias] = React.useState('');
  const [clave, onChangeClave] = React.useState('');
  const [admins, setAdmins] = useState([]);
  const [display, setDisplay] = useState('block');
  const [displayBotonAgregar, setDisplayAgregar] = useState('block');
  const [displayBotonEditar, setDisplayEditar] = useState('none');
  const [displayEliminar, setDisplayEliminar] = useState('none');
  const [displayInputs, setDisplayInputs] = useState('block');

  useEffect(() => {
    getAdmins();
  }, []);

  const getAdmins = async () => {
    const urlReadAdmins = url + 'readAll';

    const fetchApi = await fetch(urlReadAdmins, {
      method: 'GET'
    });

    const datos = await fetchApi.json();

    if (datos.status) {
      setAdmins(datos.dataset);
    } else {
      alert(datos.error);
    }
  }

  const addAdmin = async () => {
    const urlAddAdmin = url + 'createRow';

    const formData = new FormData();
    formData.append('nombreAdministrador', nombre);
    formData.append('apellidoAdministrador', apellido);
    formData.append('correoAdministrador', correo);
    formData.append('aliasAdministrador', alias);
    formData.append('claveAdministrador', clave);

    const fetchApi = await fetch(urlAddAdmin, {
      method: 'POST',
      body: formData
    });

    const datos = await fetchApi.json();

    if (datos.status) {
      Alert.alert('Administrador agregado' ,'Administrador agregado correctamente');
      setModalVisible(false);
      getAdmins();
    } else {
      Alert.alert(datos.error);
    }
  }

  const editAdmin = async () => {
    const urlEditAdmin = url + 'updateRow';

    const formData = new FormData();
    formData.append('idAdministrador', idAdmin);
    formData.append('nombreAdministrador', nombre);
    formData.append('apellidoAdministrador', apellido);
    formData.append('correoAdministrador', correo);

    const fetchApi = await fetch(urlEditAdmin, {
      method: 'POST',
      body: formData
    });

    const datos = await fetchApi.json();

    if (datos.status) {
      Alert.alert('Administrador actualizado' ,'Administrador editado correctamente');
      setModalVisible(false);
      getAdmins();
    } else {
      Alert.alert(datos.error);
    }
  }

  const deleteAdmin = async () => {
    const urlDeleteAdmin = url + 'deleteRow';

    const formData = new FormData();

    formData.append('idAdministrador', idAdmin);

    const fetchApi = await fetch(urlDeleteAdmin, {
      method: 'POST',
      body: formData
    });

    const datos = await fetchApi.json();

    if(datos.status){
      Alert.alert('Administrador eliminado' ,'Administrador eliminado correctamente');
      setModalVisible(false);
      getAdmins();
    } else{
      Alert.alert(datos.error);
    }
  }

  const handleLogOut = async () => {

    //Realizar la petición http 
    const urlLogOut = url + 'logOut';

    const fetchApi = await fetch(urlLogOut, {
      method: 'POST'
    })

    const datos = await fetchApi.json();
    if (datos.status) {
      setLogueado(!logueado)
    }
    else {
      // Alert the user about the error
      Alert.alert('Error sesion', datos.error);
    }
  }

  const agregarAdmin = async () => {
    onChangeNombre(nombre.trim());
    onChangeApellido(apellido.trim());
    onChangeCorreo(correo.trim());
    onChangeAlias(alias.trim());
    onChangeClave(clave.trim());

    if (nombre == '' || apellido == '' || correo == '' || alias == '' || clave == '') {
      alert('Asegúrese de ingresar todos los campos');
    } else if (!correo.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      alert('El correo ingresado no es válido');
    } else if (clave.length < 8) {
      alert('La contraseña debe contener por lo menos 8 caracteres');
    } else {
      addAdmin();
    }
  }

  const editarAdmin = async () => {
    onChangeNombre(nombre.trim());
    onChangeApellido(apellido.trim());
    onChangeCorreo(correo.trim());

    if (nombre == '' || apellido == '' || correo == '') {
      alert('Asegúrese de ingresar todos los campos');
    } else if (!correo.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      alert('El correo ingresado no es válido');
    } else {
      editAdmin();
    }
  }

  const abrirAgregar = async () => {
    setDisplayAgregar('block');
    setDisplayInputs('block');
    setDisplayEditar('none');
    setDisplayEliminar('none');
    setDisplay('block');
    setModalVisible(true);
    onChangeNombre('');
    onChangeApellido('');
    onChangeCorreo('');
    onChangeAlias('');
    onChangeClave('');
  }

  const abrirEditar = async (id) => {
    setDisplayAgregar('none');
    setDisplayEditar('block');
    setDisplayEliminar('none');
    setDisplayInputs('block');
    setDisplay('none');

    const urlReadOneAdmin = url + 'readOne';

    const formData = new FormData();
    formData.append('idAdministrador', id);

    const fetchApi = await fetch(urlReadOneAdmin, {
      method: 'POST',
      body: formData
    });

    const datos = await fetchApi.json();

    const row = datos.dataset;

    if (datos.status) {
      onChangeNombre(row.nombre_administrador);
      onChangeApellido(row.apellido_administrador);
      onChangeCorreo(row.correo_administrador);
      setModalVisible(true);
      setIdAdmin(id);
    } else {
      alert(datos.error);
    }
  }

  const abrirEliminar = async (id) => {
    setDisplayEliminar('block');
    setDisplayInputs('none');
    setIdAdmin(id);
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ display: displayInputs, gap: 5 }}>
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
                <View style={{ display: display }}>
                  <Text style={styles.textoLabel}>Alias</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeAlias}
                    value={alias}
                    placeholder="Alias del administrador"
                  />
                </View>
                <View style={{ display: display }}>
                  <Text style={styles.textoLabel}>Clave</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChangeClave}
                    value={clave}
                    placeholder="Clave del administrador"
                  />
                </View>
                <View style={{ display: displayBotonAgregar }}>
                  <Pressable
                    style={[styles.button]}
                    onPress={() => agregarAdmin()}
                  >
                    <Text style={styles.textStyle}>Agregar administrador</Text>
                  </Pressable>
                </View>
                <View style={{ display: displayBotonEditar }}>
                  <Pressable
                    style={[styles.button]}
                    onPress={() => editarAdmin()}
                  >
                    <Text style={styles.textStyle}>Editar administrador</Text>
                  </Pressable>
                </View>
              </View>
              <View style={{display: displayEliminar, gap:10, }}>
                <Pressable
                  style={{ backgroundColor: '#dc3545', borderRadius: 20, padding: 10 }}
                  onPress={() => deleteAdmin()}
                >
                  <Text style={styles.textStyle}>Eliminar administrador</Text>
                </Pressable>
                <Pressable
                  style={{ backgroundColor: '#6c757d', borderRadius: 20, padding: 10 }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textStyle}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable style={styles.button} onPress={() => abrirAgregar()}>
          <Text style={styles.textoBoton}>
            Agregar administrador
          </Text>
        </Pressable>
        <Pressable style={{ backgroundColor: '#dc3545', width: 200, borderRadius: 20, padding: 10, elevation: 2, }} onPress={() => handleLogOut()}>
          <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: 'white'}}>
            Cerrar sesión
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
                  <Pressable style={{ backgroundColor: '#28a745', borderRadius: 20, padding: 5 }} onPress={() => abrirEditar(item.id_administrador)}>
                    <Image style={styles.imageEdit} source={require('../images/lapiz.png')} />
                  </Pressable>
                  <Pressable style={{ backgroundColor: '#dc3545', borderRadius: 20, padding: 5 }} onPress={() => abrirEliminar(item.id_administrador)}>
                    <Image style={styles.imageEdit} source={require('../images/contenedor-de-basura.png')} />
                  </Pressable>
                </View>
              </View>
              <View style={styles.espacio}></View>
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
    alignItems: 'flex-start',
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
  botonesAcciones: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  textoLabel: {
    textAlign: 'left'
  },
  container1: {
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  container2: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  flatList: {
    flex: 1,
    width: Dimensions.get('window').width,
    gap: 200,
    paddingBottom: 20
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
