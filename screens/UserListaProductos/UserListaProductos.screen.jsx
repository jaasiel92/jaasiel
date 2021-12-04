import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import {
  StyledView,
  StyledTextoLista,
  StyledInput,
} from "../../styles/StyledComp";
import { auth, database } from "../../firebase";
import { estilosLista as styles } from "../../styles/estilosLista";
import Icon from "react-native-vector-icons/Ionicons";
import i18n from "../../localization/i18n";
import "firebase/storage";

const UserListaProductosScreen = ({
  setProdVisbles,
  IdMenu,
  setIdMenu,
  AC,
}) => {
  const [listar, setListar] = useState([]);
  //const [cantidad, setCantidad] = useState();

  useEffect(() => {
    console.log("Listando");
    listarItems();
  }, []);

  // Nuevo Item
  const agregarCarrito = (id, pd, c, pr, t) => {
    //AGREGAR producto a un objeto Pedido que deberá estar en Home.jsx
    AC(id, pd, c, pr, t);
    //setCantidad(0);
    console.log("producto: " + pd);
  };

  // Consultar la informacion
  const listarItems = () => {
    //console.log("listando");
    const todoRef = database.ref("Menu/" + IdMenu + "/productos");
    todoRef.on("value", (snapshot) => {
      const items = snapshot.val();
      const itemListar = [];
      for (let id in items) {
        itemListar.push({ id, ...items[id] });
      }
      setListar(itemListar);
      //console.log(itemListar);
    });
  };

  const regresaMenu = () => {
    setProdVisbles(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => regresaMenu()}
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Icon name="arrow-back-outline" size={34} color="green" />
            {/*<Image source={require("../../media/icons/add.png")} />*/}
          </TouchableOpacity>
        </View>
      </View>
      <StyledView special1>
        <ScrollView>
          {listar.length === 0 ? (
            <Text style={styles.textoListaVacia}>
              {i18n.t("AdminPedidos").NoProductos}
            </Text>
          ) : (
            listar?.map((item) => (
              <View key={item.id} style={styles.filaLista}>
                <View
                  style={{
                    width: "40%",
                    height: 40,
                    justifyContent: "center",
                  }}
                >
                    <Image
                      source={{ uri: item.imgUri }}
                      style={{
                        width:"100%",
                        height: 50
                    }}
                      />
                </View>
                <View
                  style={{
                    width: "30%",
                    height: 40,
                    justifyContent: "center",
                  }}
                >
                  <StyledTextoLista>{item.Titulo}</StyledTextoLista>
                </View>

                <View
                  style={{
                    width: "20%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
                  <Icon
                    name="add-circle-outline"
                    size={34}
                    color="green"
                    onPress={() =>
                      agregarCarrito(
                        item.id,
                        item.Titulo,
                        1,
                        item.Precio,
                        item.Precio
                      )
                    }
                  />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </StyledView>
    </View>
  );
};
export default UserListaProductosScreen;
