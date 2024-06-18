// App.js
import React from 'react';
import AuthNavigator from './navigation/AuthNavigator'; // Import the AuthNavigator that contains all the screens including Home

export default function App() {
  return (
    <AuthNavigator /> // Render the AuthNavigator to handle navigation between the Login, Register, and Home screens
  );
}
