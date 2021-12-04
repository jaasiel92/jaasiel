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
import { StyledTouchableOpacity } from "../../styles/StyledComp";
import i18n from "../../localization/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import "firebase/storage";

const AdminVerPedidoScreen = ({IdPedido, totalPedido, setProdVisbles}) => {

  const [listar, setListar] = useState([]);

  useEffect(() => {
    console.log("Listando");
    listarItems();
  }, []);

  // Consultar la informacion
  const listarItems = () => {
    const todoRef = database.ref("Pedidos/"+IdPedido+"/Productos");
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

  const eliminarPedido = () => {
    console.log("eliminando pedido "+eliminarPedido);
    const todoRef = database.ref("Pedidos").child(IdPedido);
    todoRef.remove();
    setProdVisbles(false);
  };
  
  const regresaPedidosLst = () => {
    setProdVisbles(false);
  };

  return (
    <View style={styles.container}>
      <View style={{
                   flexDirection: "row"
                }}>
        <Text>{i18n.t("AdminVerPedido").Orden} {IdPedido}</Text>
        <TouchableOpacity
            onPress={() => regresaPedidosLst()}
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <Icon name="arrow-back-outline" size={34} color="green" />
          </TouchableOpacity>
      </View>
      <View style={{
                   flexDirection: "row"
                }}>
      <View style={{
                    width: "70%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AdminVerPedido").Producto}</Text>
                </View>
                <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AdminVerPedido").Cantidad}</Text>
                  </View>
                  <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AdminVerPedido").Totales}</Text>
                  </View>
    </View>
      <StyledView special1>
      <ScrollView>
        {listar.length === 0 ? (
          <Text style={styles.textoListaVacia}>
            {i18n.t("AdminPedidos").NoProductos}
          </Text>
        ) : (
        listar?.map((lista) => (
          <View key={lista.id} style={styles.filaLista}>
            <View style={{
                    width: "70%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{lista.Productos}</Text>
                </View>
                <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{lista.Cantidad}</Text>
                </View>
                <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{lista.Total}</Text>
                </View>
            </View>
            ))
        )}
      </ScrollView>
    </StyledView>
    <View>
      <Text>{i18n.t("AdminVerPedido").Total} {totalPedido}</Text>
    </View>
    <View style={{
          flexDirection: "row",
          backgroundColor: "#d4cece",
          height: 100,
        }}>
    <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StyledTouchableOpacity
            cambiarSpecial
            onPress={()=>eliminarPedido()}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingRight: "15%",
                }}
              >
                {i18n.t("AdminVerPedido").btnEliminar}
              </Text>
              <Image source={require("../../media/icons/cancelar.png")} />
            </View>
          </StyledTouchableOpacity>
        </View>

        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StyledTouchableOpacity onPress={()=>eliminarPedido()}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#000000",
                  fontSize: 20,
                  fontWeight: "bold",
                  paddingRight: "15%",
                }}
              >
                {i18n.t("AdminVerPedido").btnAtender}
              </Text>
              <Image source={require("../../media/icons/pago.png")} />
            </View>
          </StyledTouchableOpacity>
        </View>
    </View>
  </View>
  );
};
export default AdminVerPedidoScreen;
