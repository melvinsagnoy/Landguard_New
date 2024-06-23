import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { firestore, auth } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const PasscodeInputScreen = ({ navigation, route }) => {
  const [passcode, setPasscode] = useState('');
  const maxDigits = 4; // Define the maximum number of digits for the passcode

  // Extract email from route params
  const email = route.params?.email || '';

  const handleNumberPress = (number) => {
    if (passcode.length < maxDigits) {
      setPasscode(passcode + number); // Concatenate the pressed number to the passcode
    }
  };

  const handleDeletePress = () => {
    if (passcode.length > 0) {
      setPasscode(passcode.slice(0, -1)); // Remove the last digit from the passcode
    }
  };

  const handleConfirmPress = async () => {
    if (passcode.length === maxDigits) {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Register passcode in Firestore under user's email as document ID
        const userDocRef = doc(firestore, 'users', email);
        await setDoc(userDocRef, {
          passcode: passcode,
        });

        navigation.navigate('Profile'); // Navigate to profile or home screen after successful verification
      } catch (error) {
        console.error('Error registering passcode:', error);
        Alert.alert('Registration Error', 'Failed to register passcode.');
      }
    } else {
      Alert.alert('Incomplete Passcode', 'Please enter 4 digits.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Passcode</Text>
      <View style={styles.passcodeContainer}>
        {/* Display passcode circles */}
        {Array.from({ length: maxDigits }).map((_, index) => (
          <View key={index} style={[styles.passcodeCircle, passcode.length > index && styles.passcodeFilled]} />
        ))}
      </View>
      {/* Number grid */}
      <View style={styles.numberGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleNumberPress(String(number))}>
            <Text style={styles.numberText}>{number}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.numberButton} onPress={handleDeletePress}>
          <Text style={styles.numberText}>DEL</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.numberButton} onPress={() => handleNumberPress('0')}>
          <Text style={styles.numberText}>0</Text>
        </TouchableOpacity>
      </View>
      {/* Confirm button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPress}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  passcodeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  passcodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0C55B',
    marginHorizontal: 10,
  },
  passcodeFilled: {
    backgroundColor: '#E0C55B', // Change color to indicate filled circle
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  numberButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#E0C55B',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  numberText: {
    fontSize: 24,
    color:'white'
  },
  confirmButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#E0C55B',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#FFF',
  },
});

export default PasscodeInputScreen;