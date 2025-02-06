import React from 'react';
import Navigation from './src/navigation';
import { enableScreens } from 'react-native-screens';

enableScreens();  // <-- Add this line

export default function App() {
  return <Navigation />;
}
