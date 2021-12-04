import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from "@react-navigation/core";
//import { INFO_PAGE_STYLES as styles } from "./Info.styles";
//import { TEXT_STYLES as textStyles } from "../../styles/text.styles";
import usrPic from "../../media/images/usr_profpic.png";
import ImagePickerScreen from "../ImgPicker";
import { estilosUsuario as styles } from "../../styles/estilosUsuario";
import i18n from "../../localization/i18n";

import { auth, database, firebase } from "../../firebase";
import 'firebase/storage';

const UserScreen = ({}) => {

  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  /*DATOS DE LA BD*/

  const [userName, setUserName] = useState('');
  const [matricula, setMatricula] = useState('');

  const ConsultaBD = () => {
    const todoRef = database
    .ref("Usuarios/"+auth.currentUser?.uid)
    .once('value')
    .then(snapshot => {
      console.log('User info: ', snapshot.val().Nombre);
      setUserName(snapshot.val().Nombre);
      setMatricula(snapshot.val().Matricula);
    });

  };

  /*IMAGE PICKER */

  // The path of the picked image
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [PickerVisible, setPickerVisible] = useState(false);

  useEffect(()=> {
    if(pickedImagePath === '') {
      //console.log("Rendereo uri: "+auth.currentUser?.uid);
      searchImage();
      ConsultaBD();
    }
  }, [pickedImagePath]);

  searchImage = async () => {
    firebase.storage().ref("users/"+auth.currentUser?.uid).getDownloadURL()
    .then(resolve => {
      console.log("imagen encontrada");
      setPickedImagePath(resolve);
      //console.log(resolve);
    }).catch(error => {
      console.log(error);
    });
  }

  const cambiarFoto = () => {
    setPickerVisible(true);
  }

  return (
    // Vista Info usuario
    !PickerVisible ? (
      <View style={styles.screen}>
      <View style={styles.screen}>
          {
            pickedImagePath !== '' ? <TouchableOpacity onPress={cambiarFoto}>
              <Image
            source={{ uri: pickedImagePath }}
            style={styles.usrPic}
            /></TouchableOpacity>:
            <TouchableOpacity onPress={cambiarFoto}>
            <Image
            source={usrPic}
            style={styles.usrPic}
            onPress={cambiarFoto}
            /></TouchableOpacity>
           }
          <Text style={styles.textoUsuario}>{i18n.t("userScreen").nombre} {userName}</Text>
          <Text style={styles.textoCorreo}>{auth.currentUser?.email}</Text>
          <Text style={styles.textoCorreo}>{i18n.t("userScreen").matricula} {matricula}</Text>
          
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>{i18n.t("userScreen").sesion}</Text>
          </TouchableOpacity>
      </View>
    </View>
    ) : (
      <ImagePickerScreen setPickerVisible={setPickerVisible} setPickedImagePath={setPickedImagePath} pickedImagePath={pickedImagePath} />
    )
  );
};
export default UserScreen;
