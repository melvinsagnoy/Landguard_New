import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { authenticateAsync } from 'expo-local-authentication';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from './NavBar';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fingerprintRegistered, setFingerprintRegistered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setLoading(true);

        try {
          await AsyncStorage.setItem('userEmail', user.email);
          const fingerprintRegistered = await checkFingerprintRegistration(user.email); // Use email as ID
          setFingerprintRegistered(fingerprintRegistered);
        } catch (error) {
          console.error('Error setting user credentials:', error);
        }

        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      auth.signOut().then(() => {
        navigation.navigate('Login');
      }).catch((error) => {
        console.error('Error logging out:', error);
      });
    } catch (error) {
      console.error('Error clearing user credentials:', error);
    }
  };

  const authenticateWithFingerprint = async () => {
    try {
      const result = await authenticateAsync({
        promptMessage: 'Authenticate with fingerprint',
      });

      if (result.success) {
        setFingerprintData(user.email, true); // Use email as ID
        setFingerprintRegistered(true);
        Alert.alert('Success', 'Fingerprint authenticated successfully!');
        navigation.navigate('Home');
      } else if (result.error) {
        console.error('Authentication failed:', result.error);
        Alert.alert('Authentication failed', 'Fingerprint authentication failed');
      } else {
        console.warn('Authentication cancelled by user');
      }
    } catch (error) {
      console.error('Error authenticating with fingerprint:', error);
      Alert.alert('Error', 'Failed to authenticate with fingerprint.');
    }
  };

  const setFingerprintData = async (email, isRegistered) => {
    const userRef = doc(firestore, 'users', email); // Use email as ID
    await updateDoc(userRef, {
      fingerprintRegistered: isRegistered,
    });
  };

  const checkFingerprintRegistration = async (email) => {
    try {
      const userRef = doc(firestore, 'users', email); // Use email as ID
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        return !!userData.fingerprintRegistered;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking fingerprint registration:', error);
      return false;
    }
  };

  const updateDisplayName = async () => {
    try {
      const email = auth.currentUser.email; // Use email as ID
      const userRef = doc(firestore, 'users', email);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        await updateDoc(userRef, {
          displayName: newName,
        });
        setUser({ ...user, displayName: newName }); // Update local state
        Alert.alert('Success', 'Display name updated successfully!');
      } else {
        await setDoc(userRef, {
          displayName: newName,
        });
        setUser({ ...user, displayName: newName }); // Update local state
        Alert.alert('Success', 'Display name added successfully!');
      }
    } catch (error) {
      console.error('Error updating display name:', error);
      Alert.alert('Error', 'Failed to update display name.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <FontAwesome name="user" size={24} color="#E0C55B" />
            <Text style={styles.text}>{user.displayName || 'No Name'}</Text>
          </View>
          <View style={styles.infoRow}>
            <FontAwesome name="envelope" size={24} color="#E0C55B" />
            <Text style={styles.text}>{user.email}</Text>
          </View>

          {!editMode ? (
            <TouchableOpacity style={styles.editProfileButton} onPress={() => setEditMode(true)}>
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editProfileContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter new display name"
                value={newName}
                onChangeText={setNewName}
              />
              <TouchableOpacity style={styles.saveButton} onPress={updateDisplayName}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          {fingerprintRegistered && (
            <Text style={styles.successMessage}>Fingerprint is registered!</Text>
          )}
        </View>
      </View>

      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  editProfileButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  editProfileButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  editProfileContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
});

export default ProfileScreen;
