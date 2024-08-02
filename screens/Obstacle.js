import React from 'react';
import { View, StyleSheet } from 'react-native';

const Obstacle = () => {
  return <View style={styles.obstacle} />;
};

const styles = StyleSheet.create({
  obstacle: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    position: 'absolute',
    top: 100, // Example position
    left: 100, // Example position
  },
});

export default Obstacle;
