import React from 'react';
import { View, StyleSheet } from 'react-native';

const Car = () => {
  return <View style={styles.car} />;
};

const styles = StyleSheet.create({
  car: {
    width: 50,
    height: 100,
    backgroundColor: 'red',
    borderRadius: 10,
  },
});

export default Car;
