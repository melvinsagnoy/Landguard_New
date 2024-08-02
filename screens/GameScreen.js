import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, Text, Button } from 'react-native';
import Car from './Car';
import Road from './Road';
import Obstacle from './Obstacle';

const { width, height } = Dimensions.get('window');

const GameScreen = ({ navigation }) => {
  const [carPosition, setCarPosition] = useState({ x: width / 2 - 25, y: height - 150 });
  const [obstacles, setObstacles] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const carAnim = useRef(new Animated.ValueXY(carPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        const newX = Math.max(0, Math.min(width - 50, gestureState.moveX - 25));
        setCarPosition({ x: newX, y: height - 150 });
      },
    })
  ).current;

  useEffect(() => {
    // Start game loop
    const gameLoop = () => {
      if (!isGameOver) {
        // Update obstacle positions
        setObstacles(prevObstacles => 
          prevObstacles.map(obstacle => ({
            ...obstacle,
            y: obstacle.y + 5
          })).filter(obstacle => obstacle.y < height)
        );
        
        // Check for collisions
        for (let obstacle of obstacles) {
          if (
            carPosition.x < obstacle.x + 50 &&
            carPosition.x + 50 > obstacle.x &&
            carPosition.y < obstacle.y + 50 &&
            carPosition.y + 100 > obstacle.y
          ) {
            setIsGameOver(true);
            return;
          }
        }

        // Add new obstacles
        if (Math.random() < 0.05) {
          setObstacles(prevObstacles => [
            ...prevObstacles,
            { x: Math.random() * (width - 50), y: -50 }
          ]);
        }

        requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => setIsGameOver(true); // Cleanup on unmount
  }, [carPosition, obstacles, isGameOver]);

  useEffect(() => {
    Animated.timing(carAnim, {
      toValue: carPosition,
      duration: 0,
      useNativeDriver: false,
    }).start();
  }, [carPosition]);

  return (
    <View style={styles.container}>
      <Road />
      <Animated.View
        style={[
          styles.car,
          { transform: [{ translateX: carAnim.x }, { translateY: carAnim.y }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Car />
      </Animated.View>
      {obstacles.map((obs, index) => (
        <Animated.View
          key={index}
          style={[
            styles.obstacle,
            { transform: [{ translateX: obs.x }, { translateY: obs.y }] },
          ]}
        >
          <Obstacle />
        </Animated.View>
      ))}
      {isGameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Button title="Play Again" onPress={() => navigation.navigate('SearchScreen')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  car: {
    position: 'absolute',
    bottom: 50,
    left: width / 2 - 25,
  },
  obstacle: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    position: 'absolute',
  },
  gameOver: {
    position: 'absolute',
    top: height / 2 - 50,
    left: width / 2 - 75,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  gameOverText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
});

export default GameScreen;
