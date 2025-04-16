import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type CartItem = {
  id: string;
  name: string;
  price: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Carrega o carrinho salvo ao abrir
  useEffect(() => {
    loadCart();
  }, []);

  const saveCart = async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e);
    }
  };

  const loadCart = async () => {
    try {
      const saved = await AsyncStorage.getItem('cartItems');
      if (saved) setCartItems(JSON.parse(saved));
    } catch (e) {
      console.error('Erro ao carregar carrinho:', e);
    }
  };

  const addProduct = () => {
    if (!productName.trim() || !productPrice.trim()) return;

    const newItem: CartItem = {
      id: Date.now().toString(),
      name: productName,
      price: parseFloat(productPrice),
    };

    const updatedCart = [...cartItems, newItem];
    setCartItems(updatedCart);
    saveCart(updatedCart);

    setProductName('');
    setProductPrice('');
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    Alert.alert('Compra finalizada!', `Total: R$ ${total.toFixed(2)}`);
    setCartItems([]);
    saveCart([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Carrinho</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Produto"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Preço"
          value={productPrice}
          onChangeText={setProductPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={addProduct}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Seu carrinho está vazio</Text>
        }
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Finalizar Compra</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#0EDFBD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: 'tomato',
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    color: '#444',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  checkoutButton: {
    backgroundColor: '#0EDFBD',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#0EDFBD',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
