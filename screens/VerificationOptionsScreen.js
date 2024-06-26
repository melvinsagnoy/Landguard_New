import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import PasscodeVerificationScreen from './PasscodeVerificationScreen'; // Import the PasscodeVerificationScreen

const VerificationOptionsScreen = ({ navigation }) => {

  const handleFingerprintVerify = async () => {
    try {
      const hasFingerprint = await LocalAuthentication.hasHardwareAsync();
      if (!hasFingerprint) {
        alert('Fingerprint authentication is not available on this device.');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        alert('No fingerprints are enrolled on this device. Please add fingerprints in device settings.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with your fingerprint',
      });

      if (result.success) {
        navigation.navigate('Home'); // Navigate to fingerprint verification screen on success
      } else {
        alert('Fingerprint authentication failed.');
      }
    } catch (error) {
      console.error('Error during fingerprint authentication:', error);
      alert('An error occurred during fingerprint authentication.');
    }
  };

  const handlePasscodeVerify = () => {
    navigation.navigate('PasscodeVerificationScreen'); // Navigate to passcode verification screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Verification Method</Text>
      <TouchableOpacity style={styles.optionButton} onPress={handleFingerprintVerify}>
        <Text style={styles.optionText}>Verify with Fingerprint</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.optionButton} onPress={handlePasscodeVerify}>
        <Text style={styles.optionText}>Verify with Passcode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#545151',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: '#E0C55B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default VerificationOptionsScreen;
