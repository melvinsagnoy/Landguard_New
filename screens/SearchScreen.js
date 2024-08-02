import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import NavBar from './NavBar';

const SearchScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Play Game</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Start Game"
          onPress={() => navigation.navigate('GameScreen')} // Ensure 'GameScreen' is the name used in your navigation setup
        />
      </View>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SearchScreen;
