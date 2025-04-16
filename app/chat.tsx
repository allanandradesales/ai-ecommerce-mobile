import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

class Message {
  text: string;
  sentBy: string;
  constructor(text: string, sentBy: string) {
    this.text = text;
    this.sentBy = sentBy;
  }
}

const Chat = () => {
  const scrollRef = useRef<FlatList>(null);
  const ws = useRef<WebSocket | null>(null);
  const params = useLocalSearchParams();
  const [chat, setChat] = useState<{ messages: Message[] }>({ messages: [] });
  const [text, setText] = useState('');
  const userData = params.username as string;

  useEffect(() => {
    ws.current = new WebSocket('ws://10.5.7.221:3000');

    ws.current.onopen = () => {
      console.log('WebSocket funcionando!');
    };

    ws.current.onmessage = ({ data }: WebSocketMessageEvent) => {
      console.log('Mensagem recebida:', data);
      const msg: Message = JSON.parse(data);
      setChat(prev => ({ messages: [...prev.messages, msg] }));
      setText('');
      scrollRef.current?.scrollToEnd({ animated: true });
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    const msg: Message = { text: text, sentBy: userData };
    setChat(prev => ({ messages: [...prev.messages, msg] }));
    ws.current?.send(JSON.stringify(msg));
    setText('');
  };

  return (
    <Fragment>
        <TouchableOpacity
  onPress={() => router.back()}
  style={{ padding: 10, backgroundColor: '#eee', margin: 10, borderRadius: 8 }}
>
  <Text style={{ fontSize: 16 }}>← Voltar</Text>
</TouchableOpacity>

      <FlatList
        ref={scrollRef}
        data={chat.messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Balloon message={item} userLogged={userData} />
        )}
        ListEmptyComponent={() => (
          <Text style={{ alignSelf: 'center', color: '#848484' }}>
            Sem mensagens no momento
          </Text>
        )}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.messageTextInputContainer}>
        <TextInput
          style={styles.messageTextInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor={Colors.light}
          value={text}
          multiline
          onChangeText={message => setText(message)}
        />
        <TouchableOpacity
          style={styles.sendButton}
          disabled={!text}
          onPress={sendMessage}>
          <Text style={{ color: Colors.white }}>Enviar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Fragment>
  );
};

const Balloon = ({
  message,
  userLogged,
}: {
  message: Message;
  userLogged: string;
}) => {
  const sent = userLogged === message.sentBy;
  const balloonColor = sent ? styles.balloonSent : styles.balloonReceived;
  const balloonTextColor = sent
    ? styles.balloonTextSent
    : styles.balloonTextReceived;
  const bubbleWrapper = sent
    ? styles.bubbleWrapperSent
    : styles.bubbleWrapperReceived;

  return (
    <View style={{ marginBottom: '2%' }}>
      <View style={{ ...styles.bubbleWrapper, ...bubbleWrapper }}>
        <View style={{ ...styles.balloon, ...balloonColor }}>
          <Text>{message.sentBy}</Text>
          <Text style={{ ...styles.balloonText, ...balloonTextColor }}>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleWrapper: {
    flexDirection: 'column',
  },
  bubbleWrapperSent: {
    alignSelf: 'flex-end',
    marginLeft: 40,
  },
 
  bubbleWrapperReceived: {
    alignSelf: 'flex-start',
    marginRight: 40,
  },
  balloon: {
    padding: 8,
    borderRadius: 16,
  },
  balloonSent: {
    backgroundColor: Colors.primary,
  },
  balloonReceived: {
    backgroundColor: Colors.white,
  },
  balloonText: {
    fontSize: 18,
  },
  balloonTextSent: {
    color: Colors.white,
  },
  balloonTextReceived: {
    color: Colors.black,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    height: 40,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginRight: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#848484',
    borderWidth: 1,
    marginTop: '3%',
    marginBottom: '5%',
    padding: 10,
  },
  changeNameView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: 'white',
  },
  container: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  scrollViewContainer: {
    padding: 10,
    top: 10,
  },
  messageTextInputContainer: {
    justifyContent: 'flex-end',
    padding: 5,
    marginBottom: 20,
    borderColor: 'transparent',
    borderTopColor: Colors.light,
    alignItems: 'center',
    flexDirection: 'row',
  },
  messageTextInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    fontSize: 17,
    borderColor: Colors.light,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: 20,


  },
});

export default Chat;
