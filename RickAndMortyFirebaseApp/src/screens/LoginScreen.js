import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error de Acceso', 'Credenciales incorrectas o usuario no registrado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick & Morty App</Text>
      <Text style={styles.subtitle}>Iniciar Sesión</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        placeholderTextColor="#999"
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#24282f' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 5, textAlign: 'center', color: '#00ff00' },
  subtitle: { fontSize: 18, marginBottom: 30, textAlign: 'center', color: '#fff' },
  input: { backgroundColor: '#3c3e44', padding: 15, borderRadius: 8, marginBottom: 15, color: '#fff', fontSize: 16 },
  button: { backgroundColor: '#ff9800', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  linkText: { color: '#00b0c8', marginTop: 20, textAlign: 'center', fontWeight: '600' }
});