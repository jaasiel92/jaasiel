import React, { useEffect, useState } from "react";
import {StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView, } from "react-native";
import { StyledView, StyledTextoLista, StyledInput } from "../../styles/StyledComp";
import { auth, database } from "../../firebase";
import { estilosLista as styles } from "../../styles/estilosLista";
import ImgPickFoodScreen from "../ImgPickFood";
import i18n from "../../localization/i18n";
import Icon from 'react-native-vector-icons/Ionicons';
import 'firebase/storage';

  const addProductoScreen = ({setProductosVisbles, IdMenu, setIdMenu}) => {
  
    const item = {"Titulo":"", "Precio": "", "imgUri":"https://firebasestorage.googleapis.com/v0/b/lunchapp-20467.appspot.com/o/ico_cafeteria.png?alt=media&token=fe8681fc-a431-4f44-a0a5-c163d8fe5adc"};
    const [titulo, setTitulo] = useState();
    const [precio, setPrecio] = useState();
    const [listar, setListar] = useState([]);

    // Nuevo Item
  const crearItem = () => {
    try {
      if (titulo.length > 0 && precio.length >0) {
        const todoRef = database.ref("Menu/"+IdMenu+"/productos");
        item.Titulo = titulo;
        item.Precio = precio;
        todoRef.push(item);
        //console.log(item);
        //listarItems();
        setTitulo(null);
        setPrecio(null);
      } else {
        alert(i18n.t("AddProductoScreen").AlertAdd);
      }
    } catch (error) {
      alert(i18n.t("AddProductoScreen").AlertAdd);
    }
  };
  
  // Consultar la informacion
  const listarItems = () => {
    //console.log("listando");
    const todoRef = database.ref("Menu/"+IdMenu+"/productos");
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
    const todoRef = database.ref("Menu/"+IdMenu+"/productos").child(ID);
    todoRef.remove();
    //listarItems();
  };

  /*IMAGE PICKER */

  // The path of the picked image
  const [PickerVisible, setPickerVisible] = useState(false);
  const [refImageUri, setRefImageUri] = useState("");
  const [refID, setRefID] = useState("");
  
  const cambiarFoto = (passID, imageUri) => {
    setRefImageUri(imageUri);
    setRefID(passID);
    setPickerVisible(true);
  }

  useEffect(() => {
    //console.log("Listando");
    listarItems();
  }, [PickerVisible]);

  const regresaMenu = () => {
      setProductosVisbles(false);
  }
  
  return (
    !PickerVisible ? ( 
    <View style={styles.container}>
      <View style={{
                   flexDirection: "row"
                }}>
      <View
        style={{
          width: "20%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={()=> regresaMenu()}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            <Icon name="arrow-forward-circle-outline" size={34} color="green" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: "80%",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Text style={{ fontSize: 20, color: "black" }}>Nuevo Producto:</Text>
      </View>
      </View>
    <View style={{
                   flexDirection: "row"
                }}
    >
      <View
        style={{
          width: "60%",
          justifyContent: "center",
        }}
      >
        <StyledInput
          placeholder="Ingresar nuevo producto"
          onChangeText={(text) => setTitulo(text)}
          value={titulo}
        />
      </View>
      <View
        style={{
          width: "20%",
          justifyContent: "center",
        }}
      >
        <StyledInput
          placeholder="Precio"
          onChangeText={(text) => setPrecio(text)}
          value={precio}
          keyboardType={'numeric'}
        />
      </View>

      <View
        style={{
          width: "20%",
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
    <View style={{
                   flexDirection: "row"
                }}>
      <View style={{
                    width: "40%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AddProductoScreen").Imagen}</Text>
                </View>
                <View style={{
                    width: "35%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AddProductoScreen").Detalles}</Text>
                  </View>
                  <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AddProductoScreen").Eliminar}</Text>
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
                style={styles.filaLista} >
                  <View style={{
                    width: "40%",
                    height: 50,
                    justifyContent: "center",
                }}>
                  <TouchableOpacity onPress={()=>cambiarFoto(item.id, item.imgUri)}>
                    <Image
                      source={{ uri: item.imgUri }}
                      style={{
                        width:"100%",
                        height: 32
                    }}
                      />
                    </TouchableOpacity>
                </View>
                <View
                style={{
                    width: "50%",
                    height: 60,
                    justifyContent: "center",
                }}
                >
                <StyledTextoLista>{item.Titulo}</StyledTextoLista>
                <StyledTextoLista>$ {item.Precio}</StyledTextoLista>
                </View>
                <View
                style={{
                    width: "10%",
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
    :(
      <ImgPickFoodScreen refMenu={IdMenu} refID={refID} setRefID={setRefID} refImageUri={refImageUri} setRefImageUri={setRefImageUri}  setPickerVisible={setPickerVisible} />
    )
  );
};
export default addProductoScreen;
