import { StatusBar } from 'expo-status-bar';
import { View, Image, ActivityIndicator } from 'react-native';
import { styles } from './styles';
import * as ImagePicker from 'expo-image-picker';
import * as tensorflow from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as FileSystem from 'expo-file-system';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

import { Button } from './components/Button';

import React, { useState } from 'react'

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSelectImage() {
    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];
        setSelectedImageUri(uri);
        await imageClassification(uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function imageClassification(imageUri: string) {
    await tensorflow.ready();
    const model = await mobilenet.load();

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const imageBuffer = tensorflow.util.encodeString(imageBase64, 'base64').buffer;
    const raw = new Uint8Array(imageBuffer);

    const imageTensor = decodeJpeg(raw);

    const classificationResult = await model.classify(imageTensor);
    console.log(classificationResult);
  }
  return (
    <View style={styles.container}>
      <StatusBar 
      style="light"
      backgroundColor='transparent'
      translucent/>

      <Image
      source={{ uri: selectedImageUri ? selectedImageUri: 'https://github.com/carlosedurochas.png' }}
      style={styles.image}
      />

      <View style={styles.results}>

      </View>

      {
        isLoading
        ? <ActivityIndicator color='#5f1bbf' />
        : <Button title='Select Image' onPress={handleSelectImage}/>
      }
    </View>
  );
}


