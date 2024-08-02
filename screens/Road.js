import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Road = () => {
  return (
    <View style={styles.road}>
      {/* You can add road details here */}
    </View>
  );
};

const styles = StyleSheet.create({
  road: {
    width: width,
    height: '100%',
    backgroundColor: '#333',
  },
});

export default Road;
