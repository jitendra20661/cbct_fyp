import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
// import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorListScreen from '../screens/DoctorListScreen';
import DoctorDetailScreen from '../screens/DoctorDetailScreen';

export type HomeStackParamList = {
  Home: undefined;
  DoctorList: { category: string };
  DoctorDetail: { doctorId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Discover' }} />
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ title: 'Doctors' }} />
      <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
};

export default HomeStack;
