import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { View } from 'react-native';
import FloatingAIButton from '../components/FloatingAIButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          // headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';

            if (route.name === 'HomeStack') {
              iconName = 'home';
            } else if (route.name === 'Appointments') {
              iconName = 'calendar-today';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4F46E5',
          tabBarInactiveTintColor: '#9CA3AF',
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false, title: 'Home' }} />
        <Tab.Screen name="Appointments" component={AppointmentsScreen} options={{ title: 'Appointments' }}/>
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }}/>
      </Tab.Navigator>
      <FloatingAIButton />
    </View>
  );
};

export default TabNavigator;
