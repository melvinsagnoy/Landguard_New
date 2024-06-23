import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { authenticateAsync, hasHardwareAsync } from 'expo-local-authentication';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [useFingerprint, setUseFingerprint] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const checkFingerprintAvailability = async () => {
    const isAvailable = await hasHardwareAsync();
    return isAvailable;
  };

  const registerUser = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      setRegistrationSuccess(true);

      // Navigate to passcode registration screen with email as parameter
      navigation.navigate('PasscodeInput', { email: email });
    } catch (error) {
      setLoading(false);
      console.error('Error registering user:', error);
      Alert.alert('Registration Error', error.message);
    }
  };

  const registerFingerprint = async () => {
    try {
      const result = await authenticateAsync({
        promptMessage: 'Authenticate to register fingerprint',
      });

      if (result.success) {
        setUseFingerprint(true);
      } else {
        Alert.alert('Fingerprint Registration Failed', 'Failed to register fingerprint.');
      }
    } catch (error) {
      console.error('Error registering fingerprint:', error);
      Alert.alert('Error', 'Failed to register fingerprint.');
    }
  };

  const navigateToPasscodeRegistration = () => {
    navigation.navigate('Passcode', { email: email });
  };

  const handleRegisterButtonPress = async () => {
    try {
      const fingerprintAvailable = await checkFingerprintAvailability();

      if (useFingerprint && fingerprintAvailable) {
        await registerFingerprint();
      } else {
        await registerUser();
      }
    } catch (error) {
      console.error('Error checking fingerprint availability:', error);
      Alert.alert('Error', 'Failed to check fingerprint availability');
    }
  };

  if (registrationSuccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.registrationSuccessText}>Registration successful!</Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, useFingerprint ? styles.activeButton : null]}
            onPress={registerFingerprint}
          >
            <Text style={styles.buttonText}>Register with Fingerprint</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !useFingerprint ? styles.activeButton : null]}
            onPress={navigateToPasscodeRegistration}
          >
            <Text style={styles.buttonText}>Register with Passcode</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegisterButtonPress} disabled={loading}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#545151', // Background color for consistency
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF', // Input background color
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0C55B', // Same color as other screens
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#4CAF50', // Same color as other screens
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  activeButton: {
    backgroundColor: '#007BFF', // Same color as other active buttons
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
  },
  registrationSuccessText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFF', // Text color for success message
  },
  loginText: {
    marginTop: 20,
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;
