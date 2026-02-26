import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './app/navigation/RootNavigator';
import { AuthProvider } from './app/context/AuthContext';
import { useEffect } from 'react';
import { api } from './app/services/api';

export default function App() {
//   useEffect(() => {
//   api.getProfile();
// }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={DefaultTheme}>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
