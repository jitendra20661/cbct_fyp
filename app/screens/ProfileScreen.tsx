import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { api } from '../services/api';
import type { Appointment, User } from '../types';

const ProfileScreen: React.FC = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    (async () => {
      if (!token) return;
      setLoading(true);
      const [p, a] = await Promise.all([api.getProfile(), api.getAppointments()]);
      if (!p.error) setProfile(p.data);
      if (!a.error) setAppointments(a.data);
      setLoading(false);
    })();
  }, [token]);

  if (!token) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Profile</Text>
        <Text style={{ paddingHorizontal: 16, textAlign: 'center', color: '#374151' }}>
          Please log in to view your profile and booking summary.
        </Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator /></View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={styles.avatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile?.name}</Text>
            <Text style={styles.subtle}>{profile?.email ?? profile?.phone}</Text>
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{appointments.length}</Text>
            <Text style={styles.subtle}>Total Bookings</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{appointments.filter(a => a.paymentStatus === 'Paid').length}</Text>
            <Text style={styles.subtle}>Payments</Text>
          </View>
        </View>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 8 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E5E7EB' },
  name: { fontSize: 18, fontWeight: '800', color: '#111827' },
  subtle: { color: '#6B7280' },
  summary: { flexDirection: 'row', gap: 12, marginTop: 20 },
  summaryItem: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  summaryNum: { fontSize: 20, fontWeight: '800', color: '#111827' },
  logoutBtn: { marginTop: 24, backgroundColor: '#EF4444', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoutText: { color: '#fff', fontWeight: '800' },
});

export default ProfileScreen;
