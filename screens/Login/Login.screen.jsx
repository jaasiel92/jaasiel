import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from "react-native";
import { estilosLogin as styles } from "../../styles/estilosLogin";
import { auth } from "../../firebase";
import logo from "../../media/images/ToDo_logo.png";
import SingUpScreen from "../SignUp";
import i18n from "../../localization/i18n";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [registroVisible, setRegistroVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsuscribe;
  }, []);
  
  /*const handleSignup = () => {
    auth
      .createUserWithEmailAndPassword(email, pwd)
      .then((userCredentials) => {
        // then is a fullfilled promise
        const user = userCredentials.user;
        console.log(user.email);
        console.log("UID");
        console.log(user.uid);
      })
      .catch((error) => {
        // catch is a rejected promise
        alert(error.message);
      });
  };*/
  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, pwd)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        console.log("Logged UID:");
        console.log(user.uid);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const nuevoUsuario = () => {
    setRegistroVisible(true);
  }

  return (
    registroVisible ? (
      <SingUpScreen setRegistroVisible= {setRegistroVisible} />
    ) : (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <Image source={logo} style={styles.logo} />
        <TextInput
          placeholder={i18n.t("LoginScreen").emailLabel}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder={i18n.t("LoginScreen").PassLabel}
          value={pwd}
          onChangeText={(text) => setPwd(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>
            {i18n.t("LoginScreen").btnLogin}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nuevoUsuario}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>
            {i18n.t("LoginScreen").btnSignUp}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>)
  );
};
export default LoginPage;
