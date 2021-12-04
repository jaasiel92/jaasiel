import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
/*import { useNavigation } from "@react-navigation/core";*/
import { estilosPicker as styles } from "../../styles/estilosPicker";

import { auth, database, firebase } from "../../firebase";
import 'firebase/storage';

const ImgPickFoodScreen = ({refMenu, refID, setRefID,  refImageUri, setRefImageUri, setPickerVisible}) => {
    const [newImageUri, setNewImageUri] = useState("");
  // This function is triggered when the "Select an image" button pressed
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(i18n.t("ImagePickerScreen").Refuse);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      uploadImage(result.uri)
      .then(resolve => {
        let ref = firebase.storage().ref().child("menu/"+refID);
        ref.put(resolve).then(resolve => {
          console.log("Imagen subida");
          //setPickedImagePath(result.uri);
          //updateDBUri();
          searchImage();
        }).catch(error => {
          console.log("Error al subir imagen");
        });
        /*console.log("Mi Blob");
        console.log(JSON.stringify(resolve));*/
      })
      .catch(error => {
        console.log(error);
      });
      //console.log(result.uri);
      //setRefID("");
      setRefImageUri("");
      setPickerVisible(false);
    }
  }

  // This function is triggered when the "Open camera" button pressed
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(i18n.t("ImagePickerScreen").Refuse);
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      uploadImage(result.uri)
      .then(resolve => {
        let ref = firebase.storage().ref().child("menu/"+refID);
        ref.put(resolve).then(resolve => {
          console.log("Imagen subida");
          //setPickedImagePath(result.uri);
          //updateDBUri();
          searchImage();
        }).catch(error => {
          console.log("Error al subir imagen");
        });
      })
      .catch(error => {
        console.log(error);
      });
      //setRefID("");
      setRefImageUri("");
      setPickerVisible(false);
      //console.log(result.uri);
    }
  }

  uploadImage = (uri) => {
        return new Promise((resolve, reject)=>{
          let xhr = new XMLHttpRequest();
          xhr.onerror = reject;
          xhr.onreadystatechange = () => {
            if(xhr.readyState === 4) {
              resolve(xhr.response);
            }
          };
          xhr.open("GET", uri);
          xhr.responseType = "blob";
          xhr.send();
        });
  }

  updateDBUri = (newUri) => {
    console.log("Modificando img comida por: "+newUri);
    console.log("en menu: "+refMenu);
    console.log("producto: "+refID);
    const todoRef = database.ref("/Menu/"+refMenu+"/productos").child(refID);
    todoRef.update({
        imgUri: newUri,
    })}

  searchImage = async () => {
    console.log("imagen buscando "+refID);
    firebase.storage().ref("menu/"+refID).getDownloadURL()
    .then(resolve => {
      console.log("imagen encontrada");
      setNewImageUri(resolve);
      console.log("getImage: "+resolve);
      updateDBUri(resolve);
    }).catch(error => {
      console.log(error);
    });
  }

  const volver = ()=> {
    setRefID("");
    setRefImageUri("");
    setPickerVisible(false);
  }

    return (
        // Vista Image Picker
        <View style={styles.screen}>
          <View style={styles.imageContainer}>
              <Image
                source={{ uri: refImageUri}}
                style={styles.image}
              />
          </View>
          {/*<View style={styles.buttonContainer}>*/}
          <View>
          <TouchableOpacity
            onPress={showImagePicker}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>
              {i18n.t("ImagePickerScreen").Galeria}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openCamera}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>
            {i18n.t("ImagePickerScreen").Camara}
            </Text>
          </TouchableOpacity>
          </View>
          <View>
          <TouchableOpacity
            onPress={volver}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>
              {i18n.t("ImagePickerScreen").Cancelar}
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      );
};

export default ImgPickFoodScreen;