import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const placeHolderImage = require('./assets/images/background-image.png')

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [selectedImage, setSelectImage] = useState(null);
  const [pickedEmoji, setPickedEmoji] = useState(null);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const imageRef = useRef();

  // Define a permissão para acessar a media do dispositivo
  if (status === null) {
    requestPermission();
  };
  
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      guallty: 1,

    });

    if (!result.canceled) {
        setSelectImage(result.assets[0].uri);
        setShowAppOptions(true);
      }else{
        alert('Você não selecionou nenhuma imagem.');
    }
  }  //Fim da função assincrona pickImageAsync

    const onReset = () => {
      setShowAppOptions(false);
    }

    const onAddSticker = () => {
      setIsModalVisible(true);
    }

    const onModalClose = () => {
      setIsModalVisible(false);
    } 

    const onSaveImageAsync = async () => {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert ("Imagem Salva");
        }

      } catch (ex){
        console.log(ex);
      }
    };
  
 return (
  <GestureHandlerRootView style={styles.container}>
    <View style={styles.imageContainer}>
      <View ref={imageRef} collapsable={false}>
       <ImageViewer 
        placeholderImageSource={placeHolderImage}
        selectedImage={selectedImage}
        />
        {pickedEmoji && <EmojiSticker imageSize={60} stickerSource={pickedEmoji}/>}
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
            <View style={styles.optionRow}>
              <IconButton icon='refresh' label='Reset' onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon='save-alt' label='Save' onPress={onSaveImageAsync} />
            </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button label='Escolha a imagem' theme='primary' onPress={pickImageAsync}/>
          <Button label='Use esta foto' onPress={() => setShowAppOptions(true)}/>
        </View> 
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
      </EmojiPicker>
      <StatusBar style="auto" />
    </View>
  </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flex:1 / 3,
    alignItems: 'center',
  },
  imageContainer: {
    flex:1,
    paddingTop: 58,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },

});
