import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";

import { auth, database } from "../../firebase";
import logo from "../../media/images/signup_logo.png";
import { estilosLogin as styles } from "../../styles/estilosLogin";
import i18n from "../../localization/i18n";

const SingUpScreen = ({setRegistroVisible}) => {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [name, setName] = useState("");
    const [matricula, setMatricula] = useState("");
    const userInfo = {"Nombre":"", "Matricula":"", "Rol":"cliente"};
  
    const handleSignup = () => {
      if(email != "" && pwd != "" && name != "" && matricula != "" ){
        auth
          .createUserWithEmailAndPassword(email, pwd)
          .then((userCredentials) => {
            const user = userCredentials.user;
            console.log(user.email);
            console.log("UID");
            console.log(user.uid);
            crearUsuarios(user.uid);
          })
          .catch((error) => {
            alert(error.message);
          });
          setRegistroVisible(false);
      }
      else{
        alert(i18n.t("SignUpScreen").alertVacio);
      }
    };

    const crearUsuarios = (ID) => {
        userInfo.Nombre = name;
        userInfo.Matricula = matricula;
        database
        .ref()
        .child("Usuarios/"+ID)
        .set(userInfo);
      };
    
      const volverAtras =() => {
        setRegistroVisible(false);
      }
    
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.inputContainer}>
          <Image source={logo} style={styles.logo} />
          <TextInput
            placeholder={i18n.t("SignUpScreen").NombreLabel}
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
          <TextInput
            placeholder={i18n.t("SignUpScreen").emailLabel}
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder={i18n.t("SignUpScreen").matriculaLabel}
            value={matricula}
            onChangeText={(text) => setMatricula(text)}
            style={styles.input}
          />
          <TextInput
            placeholder={i18n.t("SignUpScreen").PassLabel}
            value={pwd}
            onChangeText={(text) => setPwd(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSignup}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>
              {i18n.t("SignUpScreen").btnReg}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={volverAtras}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>
          {i18n.t("SignUpScreen").btnCancel}
          </Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };
  export default SingUpScreen;