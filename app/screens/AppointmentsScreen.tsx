import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import type { Appointment } from '../types';

const AppointmentsScreen: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const res = await api.getAppointments();
    if (!res.error) setAppointments(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [token]);

  const onTriggerAI = async (id: string) => {
    const res = await api.triggerAIVoiceForAppointment(id);
    if (res.error) Alert.alert('Error', res.error);
    else Alert.alert('AI Agent', 'The AI voice agent has been started for this appointment.');
  };

  if (!token) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={{ paddingHorizontal: 16, textAlign: 'center', color: '#374151' }}>
          Please log in to view and manage your appointments.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}><ActivityIndicator /></View>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Reuse component but inline here to avoid circular import issues */}
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.doctorName}</Text>
                  <Text style={styles.subtle}>{item.category}</Text>
                  <Text style={styles.when}>{item.date} • {item.timeSlot}</Text>
                  <Text>📌 {item.status} • 💳 {item.paymentStatus}</Text>
                </View>
                <TouchableOpacity onPress={() => onTriggerAI(item.id)} style={styles.smallCta}>
                  <Text style={styles.smallCtaText}>AI</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<View style={{ padding: 16 }}><Text>No appointments yet.</Text></View>}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee', flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1 },
  cardTitle: { fontWeight: '700', color: '#111827', fontSize: 16 },
  subtle: { color: '#6B7280' },
  when: { marginVertical: 6, color: '#111827', fontWeight: '500' },
  smallCta: { backgroundColor: '#4F46E5', width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  smallCtaText: { color: '#fff', fontWeight: '800', fontSize: 12 },
});

export default AppointmentsScreen;
