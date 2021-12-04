import React, { useEffect, useState } from "react";
import {StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView, } from "react-native";
import { StyledView, StyledTextoLista, StyledInput } from "../../styles/StyledComp";
import { auth, database } from "../../firebase";
import { estilosLista as styles } from "../../styles/estilosLista";
import AddProducto from "../addProducto";
import ImgPickFoodScreen from "../ImgPickFood";
import i18n from "../../localization/i18n";
import Icon from 'react-native-vector-icons/Ionicons';
import 'firebase/storage';

  const addMenuScreen = ({}) => {
  
    const item = {"Titulo":"", "imgUri":"https://firebasestorage.googleapis.com/v0/b/lunchapp-20467.appspot.com/o/ico_cafeteria.png?alt=media&token=fe8681fc-a431-4f44-a0a5-c163d8fe5adc"};
    const [titulo, setTitulo] = useState();
    const [listar, setListar] = useState([]);

    useEffect(() => {
      console.log("Listando");
      listarItems();
    }, [refImageUri]);

    // Nuevo Item
  const crearItem = () => {
    try {
      if (titulo.length > 0) {
        const todoRef = database.ref("Menu");
        item.Titulo = titulo;
        todoRef.push(item);
        //console.log(item);
        listarItems();
        setTitulo(null);
      } else {
        alert(i18n.t("AddMenuScreen").AlertTitulo);
      }
    } catch (error) {
      alert(i18n.t("AddMenuScreen").AlertTitulo);
    }
  };
  
  // Consultar la informacion
  const listarItems = () => {
    //console.log("listando");
    const todoRef = database.ref("Menu");
    todoRef.on("value", (snapshot) => {
      const items= snapshot.val();
      const itemListar= [];
      for (let id in items) {
          itemListar.push({id, ...items[id] });
      }
      setListar(itemListar);
      //console.log(itemListar);
    });
  };

  // Eliminar Item
  const eliminarItem = ( ID ) => {
    const todoRef = database.ref("Menu").child(ID);
    todoRef.remove();
    //listarItems();
  };

  const [productosVisbles, setProductosVisbles] = useState(false);
  const [IdMenu, setIdMenu] = useState("");

  const agregarProductos = (idMenu) => {
    setProductosVisbles(true);
    setIdMenu(idMenu);
  }

  /*IMAGE PICKER*/
  const [PickerVisible, setPickerVisible] = useState(false);
  const [refImageUri, setRefImageUri] = useState("");
  const [refID, setRefID] = useState("");

  const cambiarFoto = (passID, imageUri) => {
    setRefImageUri(imageUri);
    setRefID(passID);
    setPickerVisible(true);
  }

  
  return (
    !PickerVisible ? ( 
      productosVisbles ? (
        <AddProducto setProductosVisbles={setProductosVisbles} IdMenu={IdMenu} setIdMenu={setIdMenu}></AddProducto>
      ) : (
        <View style={styles.container}>
      <View
        style={styles.cabecera}
      >
        <View
          style={{
            width: "15%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>
            {i18n.t("AddMenuScreen").NuevoMenu}
          </Text>
        </View>

        <View
          style={{
            width: "75%",
            justifyContent: "center",
          }}
        >
          <StyledInput
            placeholder={i18n.t("AddMenuScreen").NuevoMenuLabel}
            onChangeText={(text) => setTitulo(text)}
            value={titulo}
          />
        </View>

        <View
          style={{
            width: "10%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={()=> crearItem()}
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={require("../../media/icons/add.png")} />
          </TouchableOpacity>
        </View>
      </View>
      <StyledView special1>
        <ScrollView>
        {listar.length === 0 ? (<Text style={styles.textoListaVacia}>
          {i18n.t("AdminPedidos").NoProductos}
        </Text>) : 
        (
          listar?.map((item) => (
            <View key={item.id}
                  style={styles.filaLista}
              >
                <View
                  style={{
                      width: "30%",
                      height: 50,
                      justifyContent: "center",
                  }}
                  >
                  <StyledTextoLista>
                  <TouchableOpacity onPress={()=>cambiarFoto(item.id, item.imgUri)}>
                      <Image
                        source={{ uri: item.imgUri }}
                        style={{
                          width: 100,
                          height: 50
                      }}
                        />
                      </TouchableOpacity>
                    </StyledTextoLista>
                  </View>
                  <View
                  style={{
                      width: "30%",
                      height: 50,
                      justifyContent: "center",
                  }}
                  >
                  <StyledTextoLista onPress={()=>agregarProductos(item.id)}>{item.Titulo}</StyledTextoLista>
                  </View>

                  <View
                  style={{
                      width: "20%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                  }}
                  >
                  <TouchableOpacity onPress={()=>agregarProductos(item.id)}>
                  <Icon
                    name="add-circle-outline"
                    size={34}
                    color="green"
                  />
                    </TouchableOpacity>
                  
                  </View>

                  <View
                  style={{
                      width: "20%",
                      height: 50,
                      justifyContent: "center",
                      alignItems: "center",
                  }}
                  >
                  <Icon name="trash-outline" size={34} color="red" onPress={()=>eliminarItem(item.id)} />
                  </View>
              </View>
          )))}
        </ScrollView>
      </StyledView>
    </View>
      )
    ) : (
      <ImgPickFoodScreen refMenu={IdMenu} refID={refID} setRefID={setRefID} refImageUri={refImageUri} setRefImageUri={setRefImageUri}  setPickerVisible={setPickerVisible} />  
    )
  );
};
export default addMenuScreen;
