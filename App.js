import { StatusBar, setStatusBarBackgroundColor } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Button, Keyboard, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import 'react-native-url-polyfill/auto';
import axios from 'axios';
import Markdown from 'react-native-markdown-display';

// api key sk-ff6aa93c89f74573b6381b7c19494165

const api_key = 'sk-ff6aa93c89f74573b6381b7c19494165'

export default function App() {

  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState('')

  const generatedResult = () => {
    setLoading(true)
    let data = JSON.stringify({
      "messages": [
        {
          "content": "hello",
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
      setResult(JSON.stringify(response.data.choices[0].message.content));
      setLoading(false)
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', margin: 10}}>
      <TextInput onChangeText={text => {setRequest(text)}} style={{borderWidth: 1, borderRadius: 20, padding: 10, width: '70%'}} placeholder='Введите запрос'/>
      <Button title='Отправить' onPress={generatedResult}/>
      </View>
      <View style={{padding: 10, borderWidth: 0, width: '90%', height: '60%', justifyContent: 'center', alignItems: 'center'}}>
      <ScrollView>
          {loading ? <ActivityIndicator style={{alignSelf: 'center'}}/> : (
            <FinishResult request={request} result={result}/>
          )}
      </ScrollView>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function FinishResult({request, result}) {
  return (
    <View>
      <Text> </Text>
      <Markdown>{result}</Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
});
