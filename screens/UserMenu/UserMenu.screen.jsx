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
import UserListaProductos from "../UserListaProductos";
import { auth, database } from "../../firebase";
import { estilosLista as styles } from "../../styles/estilosLista";
import i18n from "../../localization/i18n";
import Icon from "react-native-vector-icons/Ionicons";
import "firebase/storage";

const UserMenuScreen = (props) => {
  const [listar, setListar] = useState([]);

  useEffect(() => {
    console.log("Listando");
    listarItems();
  }, []);

  // Consultar la informacion
  const listarItems = () => {
    //console.log("listando");
    const todoRef = database.ref("Menu");
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
  const [IdMenu, setIdMenu] = useState("");

  const elegirProductos = (idMenu) => {
    setProdVisbles(true);
    setIdMenu(idMenu);
  };

  //////////////////////////////////////////////////////////////////////////////////////
  const agregarCarritos = (prdID, prod, cant, prec, total) => {
    let newPrd = true;
    let updatePC = props.PC?.map(item => {
      if(item.id == prdID) {
        let newCant = item.Cantidad + 1;
        //console.log("nueva cantidad: "+newCant);
        let newTotal = parseFloat(item.Total) + parseFloat(prec);
        //console.log("nuevo Total: "+newTotal);
        newPrd = false;
        return {...item, Cantidad: newCant, Total: newTotal}
      } else {
        return item;
      }
    });
    //console.log(updatePC);

    if(newPrd) {
      //Agregando nuevo producto
      props.SetPC([
        ...props.PC,
        {
          id: prdID,
          Productos: prod,
          Precio: prec,
          Cantidad: parseFloat(cant),
          Total: parseFloat(total),
        },
      ]);
      alert(i18n.t("UserMenu").alertAgregado);
    }else {
      //Actualizando productos
      props.SetPC(updatePC);
      alert(i18n.t("UserMenu").alertActualizado);
    }
  };

  return prodVisbles ? (
    <UserListaProductos
      setProdVisbles={setProdVisbles}
      IdMenu={IdMenu}
      setIdMenu={setIdMenu}
      AC={agregarCarritos}
    ></UserListaProductos>
  ) : (
    <View style={styles.container}>
      <StyledView special1>
        <ScrollView>
          {listar.length === 0 ? (
            <Text style={styles.textoListaVacia}>
              {i18n.t("AdminPedidos").NoProductos}
            </Text>
          ) : (
            listar?.map((item) => (
              <View key={item.id} style={styles.filaLista}>
                <View style={{
                    width: "30%",
                    height: 50,
                    justifyContent: "center",
                  }}>
                      <Image
                        source={{ uri: item.imgUri }}
                        style={{
                          width: 100,
                          height: 50
                      }}
                        />
                </View>
                <View
                  style={{
                    width: "50%",
                    height: 50,
                    justifyContent: "center",
                  }}
                >
                  <StyledTextoLista onPress={() => elegirProductos(item.id)}>
                    {item.Titulo}
                  </StyledTextoLista>
                </View>

                <View
                  style={{
                    width: "20%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => elegirProductos(item.id)}
                  >
                    <Icon name="arrow-forward-circle-outline" size={34} color="green" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </StyledView>
    </View>
  );
};
export default UserMenuScreen;
