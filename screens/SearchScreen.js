import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from './NavBar'; // Adjust the path according to your project structure

const SearchScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search Screen</Text>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
