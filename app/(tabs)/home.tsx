import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Loja!</Text>
      <Text style={styles.subtitle}>Escolha uma opção abaixo:</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cart')}>
        <Text style={styles.buttonText}>Ir para o Carrinho</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/chat')}>
        <Text style={styles.buttonText}>Abrir Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert('Mais opções em breve!')}>
        <Text style={styles.buttonText}>Outra funcionalidade</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0EDFBD',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    color: '#0EDFBD',
    fontWeight: 'bold', // Added bold text style
  },
  button: {
    backgroundColor: '#0EDFBD',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
