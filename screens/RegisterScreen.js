import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useFonts } from 'expo-font';

const registerValidationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Optionally display a loading screen or spinner while fonts load
  }

  const handleRegister = (values) => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        setLoading(false);
        Alert.alert('Registration successful!');
        navigation.navigate('LANDGUARD'); // Navigate to LoginScreen after successful registration
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Registration error', error.message);
      });
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
          validationSchema={registerValidationSchema}
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <View style={styles.header}>
                <Text style={[styles.title, { fontFamily: 'Poppins' }]}>Registration</Text>
              </View>
              <Text style={[styles.label, { fontFamily: 'Poppins' }]}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholderTextColor="#7C7A7A"
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <Text style={[styles.label, { fontFamily: 'Poppins' }]}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                placeholderTextColor="#7C7A7A"
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <Text style={[styles.label, { fontFamily: 'Poppins' }]}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry
                placeholderTextColor="#7C7A7A"
              />
              {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#E0C55B' }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>

        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={[styles.orText, { fontFamily: 'Poppins' }]}>Or Sign up with</Text>
          <View style={styles.separator} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity onPress={handleGoogleSignIn} disabled={loading}>
            <Image source={require('../assets/google.png')} style={styles.googleLogo} />
          </TouchableOpacity>

          <Text style={[styles.orText, { fontFamily: 'Poppins' }]}>Or</Text>

          <TouchableOpacity onPress={handleFacebookSignIn} disabled={loading}>
            <Image source={require('../assets/facebook.png')} style={styles.facebookLogo} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('LANDGUARD')}>
          <Text style={styles.registerText}>Already have an account? Login</Text>
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
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 0,
  },
  label: {
    fontSize: 15,
    padding: 5,
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Poppins',
  },
  title: {
    color: 'white',
    padding: 10,
    marginTop: 0,
    fontSize: 40,
    fontFamily: 'Poppins',
  },
  form: {
    flex: 1,
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
    marginBottom: 10,
    height: 20,
    fontSize: 12,
    color: 'red',
  },
  registerText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  button: {
    width: 300,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E0C55B',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  orText: {
    marginHorizontal: 10,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
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
});

export default RegisterScreen;
