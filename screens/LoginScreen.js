import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { auth, googleProvider, facebookProvider } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useFonts } from 'expo-font';

const loginValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'), // Replace with your font file path
  });

  if (!fontsLoaded) {
    return null; // Load font here
  }

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Error', error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Google Sign-In Error', error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, facebookProvider);
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      Alert.alert('Facebook Sign-In Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Formik
          validationSchema={loginValidationSchema}
          initialValues={{ email: '', password: '' }}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.header}>
                <Text style={[styles.label, styles.title, { fontFamily: 'Poppins' }]}>Sign-In</Text>
              </View>
              <Text style={[styles.label, styles.emailLabel, { fontFamily: 'Poppins' }]}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholderTextColor="#7C7A7A"
                fontFamily='Poppins'
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <Text style={[styles.label, styles.passLabel, { fontFamily: 'Poppins' }]}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                placeholderTextColor="#7C7A7A"
                fontFamily='Poppins'
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#E0C55B' }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Log-in</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={[styles.orText, { fontFamily: 'Poppins' }]}>Or Sign in with</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity onPress={handleGoogleSignIn} disabled={loading} style={styles.socialButton}>
            <Image source={require('../assets/google.png')} style={styles.googleLogo} />
          </TouchableOpacity>
          <Text style={styles.orText}>Or</Text>
          <TouchableOpacity onPress={handleFacebookSignIn} disabled={loading} style={styles.socialButton}>
            <Image source={require('../assets/facebook.png')} style={styles.facebookLogo} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.registerText, { fontFamily: 'Poppins' }]}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#545151',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  emailLabel: {
    marginTop: 20,
    padding: 5,
    fontSize: 15,
    marginLeft: 25,
    color: 'white',
  },
  passLabel: {
    padding: 5,
    fontSize: 15,
    marginLeft: 25,
    color: 'white',
  },
  label: {
    fontSize: 15,
    padding: 5,
    color: 'white',
    alignSelf: 'flex-start', // Align text to the start of the container
  },
  title: {
    color: 'white',
    padding: 10,
    marginTop: 0,
    fontSize: 40,
  },
  form: {
    width: '100%', // Ensure the form takes up the full width
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    height: 45,
    borderColor: '#7C7A7A',
    borderWidth: 2,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 20,
    color: 'white',
  },
  errorText: {
    height: 20,
    fontSize: 12,
    color: 'red',
    alignSelf: 'center', // Center the error text horizontally
  },
  registerText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
  },
  orText: {
    marginHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: 300,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E0C55B', // Assuming this is the color you want for the button background
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset for the shadow
    shadowOpacity: 0.5, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    elevation: 5, // Elevation for Android to support shadow on some devices
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
  },
  socialButton: {
    marginHorizontal: 10,
  },
  googleLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  facebookLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
