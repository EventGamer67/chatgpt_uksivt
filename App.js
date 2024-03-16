import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Button, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';
import { Prism } from 'react-syntax-highlighter';
import { duotoneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClimbingBoxLoader } from 'react-spinners';
import * as Animatable from 'react-native-animatable';
// api key sk-ff6aa93c89f74573b6381b7c19494165

const api_key = 'sk-ff6aa93c89f74573b6381b7c19494165'

export default function App() {

  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState('')

  const generatedResult = () => {
    Keyboard.dismiss()
    setLoading(true)
    let data = JSON.stringify({
      "messages": [
        {
          "content": "",
          "role": "system"
        },
        {
          "content": request,
          "role": "user"
        }
      ],
      "model": "deepseek-coder",
      "frequency_penalty": 0,
      "max_tokens": 2048,
      "presence_penalty": 0,
      "stop": null,
      "stream": false,
      "temperature": 1,
      "top_p": 1
    });
  
    
    let config = {
      method: 'post',
    maxBodyLength: Infinity,
      url: 'https://api.deepseek.com/v1/chat/completions',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Authorization': `Bearer ${api_key}`
      },
      data : data
    };
    
    axios(config)
    .then((response) => {
      setResult(response.data.choices[0].message.content.trim());
      setLoading(false)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View animation={'fadeIn'} duration={1500} style={{flexDirection: 'row', margin: 10, width: '90%', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 20}}>
        <TextInput placeholderTextColor={'white'} onChangeText={text => {setRequest(text)}} style={{borderWidth: 1, borderColor: 'white', color: 'white', borderRadius: 20, padding: 10, margin: 10, width: '60%'}} placeholder='Введите запрос'/>
        <TouchableOpacity disabled={loading ? true : false} onPress={generatedResult} style={{borderWidth: 1, borderRadius: 20, borderColor: 'white', padding: 10, margin: 10}}>
          <Text style={{color: 'white'}}>Отправить</Text>
        </TouchableOpacity>
      </Animatable.View>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {Platform.OS === 'android' || Platform.OS === 'ios' ? <ActivityIndicator/> : <ClimbingBoxLoader color='white'/>}
          <Text style={{color: 'white', marginVertical: 20}}>Загрузка может занять некоторое время...</Text>
        </View>
      ) : (
      <View style={{flex: 1, padding: 10, borderWidth: 0, width: '90%', height: '60%', justifyContent: 'center', alignItems: 'center'}}>  
        <ScrollView style={{width: '100%', padding: 10, borderRadius: 20}}>
            <FinishResult request={request} result={result}/>
        </ScrollView>
      </View>
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

function FinishResult({request, result}) {

  const renderers = {
    code: ({language, value}) => (
      <Prism language={language} style={duotoneDark}>
        {value}
      </Prism>
    )
  }
  //const text = result.toString()
  return (
    <View style={{marginBottom: 20}}>
      <Markdown style={markdownStyles} renderers={renderers}>{result}</Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121525',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 10
  },
});

const markdownStyles = StyleSheet.create({
  text: {
    color: 'white',
  },
  // Добавьте другие стили, если нужно
});
