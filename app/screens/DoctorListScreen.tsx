import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStack';
import { api } from '../services/api';
import type { Doctor } from '../types';
import DoctorCard from '../components/DoctorCard';

export type DoctorListScreenProps = NativeStackScreenProps<HomeStackParamList, 'DoctorList'>;

const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ route, navigation }) => {
  const { category } = route.params;
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    (async () => {
      const res = await api.getDoctorsByCategory(category);
      if (!res.error) setDoctors(res.data);
      setLoading(false);
    })();
  }, [category]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}> 
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <DoctorCard doctor={item} onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })} />
          )}
          ListEmptyComponent={
            <View style={styles.center}> 
              <Text>No doctors found in {category}.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default DoctorListScreen;
