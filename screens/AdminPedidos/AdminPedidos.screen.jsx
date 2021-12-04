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
import { StyledView, StyledTextoLista, StyledInput } from "../../styles/StyledComp";
import { auth, database } from "../../firebase";
import { estilosLista as styles } from "../../styles/estilosLista";
import AdminVerPedido from "../AdminVerPedido";
import i18n from "../../localization/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import "firebase/storage";

const addMenuScreen = ({}) => {

  const [listar, setListar] = useState([]);

  useEffect(() => {
    console.log("Listando");

    listarItems();
  }, []);

  // Consultar la informacion
  const listarItems = () => {
    //console.log("listando");
    const todoRef = database.ref("Pedidos");
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

  const [prodVisbles, setProdVisbles] = useState(false);
  const [IdPedido, setIdPedido] = useState("");
  const [totalPedido, setTotalPedido] = useState("");
  
  const verDetalles = (idPed, totalPed) => {
    console.log("Manda pedido: "+idPed)
    setIdPedido(idPed);
    console.log("IdPedido="+IdPedido);
    setTotalPedido(totalPed);
    setProdVisbles(true);
  };
    
  return (
    prodVisbles ? (
      <AdminVerPedido IdPedido={IdPedido} totalPedido={totalPedido} setProdVisbles={setProdVisbles}
    ></AdminVerPedido>
    ):
    (
    <View style={styles.container}>
      <View style={{
                   flexDirection: "row"
                }}>
      <View style={{
                    width: "70%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AdminPedidos").Folio}</Text>
                </View>
                <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AdminPedidos").Total}</Text>
                  </View>
                  <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text>{i18n.t("AdminPedidos").Detalles}</Text>
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
                  <Text onPress={()=>verDetalles(lista.id, lista.Total_PrecioPedido)}>{lista.id}</Text>
                </View>
                <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Text onPress={()=>verDetalles(lista.id, lista.Total_PrecioPedido)}>{lista.Total_PrecioPedido}</Text>
                </View>
                <View style={{
                    width: "15%",
                    height: 50,
                    justifyContent: "center",
                }}
                >
                  <Icon name="arrow-forward-circle-outline" size={34} color="green" onPress={()=>verDetalles(lista.id, lista.Total_PrecioPedido)} />
                </View>
            </View>
            ))
        )}
      </ScrollView>
    </StyledView>
  </View>
  )
  );
};
export default addMenuScreen;
