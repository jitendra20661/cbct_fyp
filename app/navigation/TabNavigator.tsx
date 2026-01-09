import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View } from 'react-native';
import FloatingAIButton from '../components/FloatingAIButton';

export type TabParamList = {
  HomeStack: undefined;
  Appointments: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  // Wrap the navigator to overlay FloatingAIButton above the tab bar
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false }} >
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'Appointments' }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }}/>
      </Tab.Navigator>
      <FloatingAIButton />
    </View>
  );
};

export default TabNavigator;
