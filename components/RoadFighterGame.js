// components/RoadFighterGame.js
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Matter from 'matter-js';
import Svg, { Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const RoadFighterGame = () => {
  const engine = useRef(Matter.Engine.create());
  const world = engine.current.world;
  const [score, setScore] = useState(0);
  const [carPosition, setCarPosition] = useState({ x: width / 2, y: height - 60 });
  const [obstacles, setObstacles] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine.current);

    // Create road
    const road = Matter.Bodies.rectangle(width / 2, height / 2, width, height, {
      isStatic: true,
      render: {
        fillStyle: '#333',
      },
    });

    // Create car
    const car = Matter.Bodies.rectangle(width / 2, height - 60, 60, 30, {
      render: {
        fillStyle: '#F00',
      },
    });

    // Create obstacles
    const initialObstacles = [
      Matter.Bodies.rectangle(Math.random() * (width - 60), -50, 60, 30, {
        render: {
          fillStyle: '#0F0',
        },
      }),
    ];

    // Add bodies to the world
    Matter.World.add(world, [road, car, ...initialObstacles]);

    // Update obstacles state
    setObstacles(initialObstacles);

    // Collision detection
    Matter.Events.on(engine.current, 'collisionStart', (event) => {
      const pairs = event.pairs;
      pairs.forEach((pair) => {
        if (pair.bodyA === car || pair.bodyB === car) {
          setScore(prevScore => prevScore + 1); // Increment score on collision
        }
      });
    });

    // Game loop
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdate;

      // Update the engine with a fixed time step
      if (deltaTime > 16) { // Approximately 60 FPS
        Matter.Engine.update(engine.current, 1000 / 60);

        // Update obstacles position
        setObstacles(prevObstacles => {
          const updatedObstacles = prevObstacles.map(obstacle => {
            if (obstacle.position.y > height) {
              Matter.Body.setPosition(obstacle, {
                x: Math.random() * (width - 60),
                y: -30,
              });
            }
            return obstacle;
          });
          return updatedObstacles;
        });

        // Update car position
        setCarPosition({
          x: car.position.x,
          y: car.position.y,
        });

        setLastUpdate(now);
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      Matter.World.clear(world);
      Matter.Engine.clear(engine.current);
    };
  }, [lastUpdate]);

  return (
    <View style={styles.gameContainer}>
      <Text style={styles.score}>Score: {score}</Text>
      <Svg width={width} height={height}>
        {/* Render road */}
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#333"
        />
        {/* Render car */}
        <Rect
          x={carPosition.x - 30}
          y={carPosition.y - 15}
          width={60}
          height={30}
          fill="#F00"
        />
        {/* Render obstacles */}
        {obstacles.map((obstacle, index) => (
          <Rect
            key={index}
            x={obstacle.position.x - 30}
            y={obstacle.position.y - 15}
            width={60}
            height={30}
            fill="#0F0"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    marginVertical: 20,
    position: 'absolute',
    top: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default RoadFighterGame;
