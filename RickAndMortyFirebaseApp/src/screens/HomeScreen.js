import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { auth, db } from '../../FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Consumir la API de Rick and Morty
  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/character')
      .then((response) => response.json())
      .then((data) => {
        setCharacters(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Guardar datos de la API en la base de datos Firebase NoSQL
  const guardarEnFirebase = async (personaje) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Debes estar autenticado.');
        return;
      }

      // Creamos un documento único combinando la ID del usuario y la ID del personaje
      const docId = `${user.uid}_${personaje.id}`;
      await setDoc(doc(db, "personajes_favoritos", docId), {
        userId: user.uid,
        characterId: personaje.id,
        name: personaje.name,
        status: personaje.status,
        species: personaje.species,
        image: personaje.image,
        fechaGuardado: new Date().toISOString()
      });

      Alert.alert('¡Guardado!', `${personaje.name} se ha guardado en tu Firebase NoSQL.`);
    } catch (error) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text>Cargando personajes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rick & Morty App</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1, marginLeft: 15 }}> 
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>{item.species} - {item.status}</Text>
              <TouchableOpacity style={styles.saveButton} onPress={() => guardarEnFirebase(item)}>
                <Text style={styles.saveButtonText}>Guardar NoSQL</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#24282f', paddingHorizontal: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: '#3c3e44' },
  headerText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#ff4d4d', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  card: { flexDirection: 'row', backgroundColor: '#3c3e44', marginBottom: 15, borderRadius: 10, overflow: 'hidden', alignItems: 'center' },
  image: { width: 100, height: 100 },
  infoContainer: { flex: 1, padding: 10, justifyContent: 'center' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  details: { color: '#9e9e9e', fontSize: 14, marginVertical: 4 },
  saveButton: { backgroundColor: '#ff9800', paddingVertical: 6, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});