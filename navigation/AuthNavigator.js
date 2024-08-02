// navigation/AuthNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LandingScreen from '../screens/LandingScreen';
import SearchScreen from '../screens/SearchScreen';
import AddScreen from '../screens/AddScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FingerprintVerification from '../screens/FingerprintVerification';
import PasscodeInputScreen from '../screens/PasscodeInputScreen';
import VerificationOptionsScreen from '../screens/VerificationOptionsScreen';
import PasscodeVerificationScreen from '../screens/PasscodeVerificationScreen';
import GameScreen from '../screens/GameScreen'; // Import your GameScreen

const Stack = createStackNavigator();

const AuthNavigator = ({ toggleTheme, isDarkTheme }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          options={{ headerShown: false }}
        >
          {(props) => <HomeScreen {...props} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Search"
          options={{ headerShown: false }}
        >
          {(props) => <SearchScreen {...props} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Add"
          options={{ headerShown: false }}
        >
          {(props) => <AddScreen {...props} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Notifications"
          options={{ headerShown: false }}
        >
          {(props) => <NotificationsScreen {...props} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Profile"
          options={{ headerShown: false }}
        >
          {(props) => <ProfileScreen {...props} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />}
        </Stack.Screen>
        <Stack.Screen
          name="Fingerprint"
          component={FingerprintVerification}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Passcode"
          component={PasscodeInputScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerificationOptions"
          component={VerificationOptionsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasscodeVerificationScreen"
          component={PasscodeVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GameScreen" // Add this line
          component={GameScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
