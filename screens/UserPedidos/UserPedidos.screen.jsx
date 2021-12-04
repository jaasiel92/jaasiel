import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import usrPic from "../../media/images/usr_profpic.png";
import ImagePickerScreen from "../ImgPicker";
import { estilosUsuario as styles } from "../../styles/estilosUsuario";
import Icon from "react-native-vector-icons/Ionicons";
import i18n from "../../localization/i18n";
import { auth, database, firebase } from "../../firebase";
import "firebase/storage";
import { StyledTouchableOpacity } from "../../styles/StyledComp";

const UserPedidosScreen = (props) => {
  
  const perdidosPago = {
    Estatus: "Pendiente",
    Cliente: auth.currentUser?.uid,
    Total_PrecioPedido: ObtnerTotales(),
    Productos: { ...props.PC},
  };

  useEffect(() => {
    console.log(perdidosPago);
  }, []);

  function currencyFormat(num) {
    return parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  const eliminarItem = (id) => {
    props.SetPC(
      props.PC.filter((item) => {
        if (item.id !== id) return true;
      })
    );
  };

  function ObtnerTotales() {
    return currencyFormat(
      props.PC.reduce((totales, suma) => (totales += suma.Total), 0)
    );
  }

  // Cambiar cantidad
  function cambiaCantidad(prdID, precio, cant, op) {
    let eliminaPrd = false;
    //console.log("cambiando cantidad");
    let newCantidad
    if(op === "sum"){
      //console.log("sumando");
      newCantidad = cant+1;
    }else {
      //console.log("Restando, cantidad: "+cant);
      if(cant=="1"){
        //console.log("Eliminando");
        eliminaPrd = true;
      }
      else {
        newCantidad = cant-1;
      }
    }

    if(eliminaPrd) {
      eliminarItem(prdID);
    }else {
      let newTotal =  parseFloat(newCantidad) * parseFloat(precio);
      //console.log("actualiza cant - newTotal: "+newTotal);
      let updatePC = props.PC?.map(item => {
        if(item.id == prdID) {
          return {...item, Cantidad: newCantidad, Total: newTotal}
        }
        return item;
      });
      props.SetPC(updatePC);
      console.log("PC actualizado");
    }
  }

  const vaciarCarrito = () => {
    Alert.alert(
      i18n.t("UserPedidos").alertEliminarTit,
      i18n.t("UserPedidos").alertEliminarMsg,
      [
        {text: i18n.t("UserPedidos").alertEliminarSi, onPress: () => 
        props.SetPC([])
      },
        {text: i18n.t("UserPedidos").alertEliminarNo, onPress: () => console.log("usuario cancelo eliminar"), style: "cancel"},
      ],
      {
        cancelable: true
      }
    );
  }

  // Nuevo Item
  const crearItem = () => {
    Alert.alert(
      i18n.t("UserPedidos").alertConfirmarTit,
      i18n.t("UserPedidos").alertConfirmarMsg,
      [
        {text: i18n.t("UserPedidos").alertEliminarSi, onPress: () => {
        try {
          if (props.PC.length > 0) {
            const todoRef = database.ref("Pedidos");
            todoRef.push(perdidosPago);
            //console.log(perdidosPago);
            props.SetPC([]);
            alert(i18n.t("UserPedidos").alertEnvio);
          } else {
            alert(i18n.t("UserPedidos").alertVacio);
          }
        } catch (error) {
          alert(i18n.t("UserPedidos").alertVacio);
        }
      }
      },
        {text: i18n.t("UserPedidos").alertEliminarNo, onPress: () => console.log("usuario cancelo eliminar"), style: "cancel"},
      ],
      {
        cancelable: true
      }
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#ffff",
          height: 30,
        }}
      >
        <View
          style={{
            width: "40%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {i18n.t("UserPedidos").Producto}
          </Text>
        </View>

        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {i18n.t("UserPedidos").Cant}
          </Text>
        </View>

        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {i18n.t("UserPedidos").Precio}
          </Text>
        </View>

        <View
          style={{
            width: "20%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {i18n.t("UserPedidos").Totales}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          height: "75%",
        }}
      >
        <ScrollView>
          {props.PC.length === 0 ? (
            <Text style={styles.textoListaVacia}>
              {i18n.t("AdminPedidos").NoProductos}
            </Text>
          ) : (
            props.PC?.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  backgroundColor: "#ffffff",
                  height: 30,
                }}
              >
                <View
                  style={{
                    width: "5%",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name="trash-outline"
                    size={20}
                    color="red"
                    onPress={() => eliminarItem(item.id)}
                  />
                </View>

                <View
                  style={{
                    width: "35%",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {item.Productos}
                  </Text>
                </View>

                <View
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flexDirection: "row"
                  }}
                >
                  <Icon name="remove-circle" size={34} color="red" 
                  onPress={()=>cambiaCantidad(item.id, item.Precio, item.Cantidad, "res")} />
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {item.Cantidad}
                  </Text>
                  <Icon name="add-circle" size={34} color="green" 
                  onPress={()=>cambiaCantidad(item.id, item.Precio, item.Cantidad, "sum")} />
                </View>

                <View
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {item.Precio}
                  </Text>
                </View>

                <View
                  style={{
                    width: "20%",
                    justifyContent: "center",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "black" }}>
                    {item.Total}
                    {/*currencyFormat(item.Cantidad * item.Precio)*/}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          height: 50,
        }}
      >
        <View
          style={{
            width: "75%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
          {i18n.t("UserPedidos").Total}
          </Text>
        </View>

        <View
          style={{
            width: "25%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 20, color: "black", fontWeight: "bold" }}>
            $
          </Text>
          <Text style={{ fontSize: 20, color: "black" }}>
            {ObtnerTotales()}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          backgroundColor: "#d4cece",
          height: 100,
        }}
      >
        <View
          style={{
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StyledTouchableOpacity
            cambiarSpecial
            onPress={() => vaciarCarrito()}
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
                {i18n.t("UserPedidos").btnCancelar}
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
          <StyledTouchableOpacity onPress={crearItem}>
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
                {i18n.t("UserPedidos").btnConfirmar}
              </Text>
              <Image source={require("../../media/icons/pago.png")} />
            </View>
          </StyledTouchableOpacity>
        </View>
      </View>
    </View>
    // <View>

    //     <Text>Listar Todos los Pedidos solo del usuario activo</Text>
    //     <Text>Mostrar lista de pedidos y al click mostar otro componente
    //       con los detalles del pedido (título de cada producto, cantidad, precio indivisual
    //       y total a pagar)</Text>
    // </View>
  );
};
export default UserPedidosScreen;
