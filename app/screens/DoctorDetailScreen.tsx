import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/HomeStack';
import { api } from '../services/api';
import type { Doctor } from '../types';
import { AuthContext } from '../context/AuthContext';

export type DoctorDetailScreenProps = NativeStackScreenProps<HomeStackParamList, 'DoctorDetail'>;

const DoctorDetailScreen: React.FC<DoctorDetailScreenProps> = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booking, setBooking] = useState<{ busy: boolean; step?: string }>({ busy: false });
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const res = await api.getDoctor(doctorId);
      if (!res.error) {
        setDoctor(res.data);
        // Preselect first available date+slot for convenience
        const entries = Object.entries(res.data.availability ?? {});
        if (entries.length) {
          setSelectedDate(entries[0][0]);
          setSelectedTime((entries[0][1] as string[])?.[0] ?? null);
        }
      }
      setLoading(false);
    })();
  }, [doctorId]);

  const dates = useMemo(() => Object.keys(doctor?.availability ?? {}), [doctor]);
  const slots = useMemo(() => (selectedDate ? doctor?.availability?.[selectedDate] ?? [] : []), [doctor, selectedDate]);

  const onBook = async () => {
    if (!doctor) return;
    if (!token) {
      navigation.navigate('Home'); // ensure in stack then push login modal
      // Using RootNavigator to show Login
      // @ts-ignore accessing root stack from nested navigator
      navigation.getParent()?.navigate?.('Login');
      return;
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert('Select Slot', 'Please choose a date and time slot.');
      return;
    }

    // try {
    //   setBooking({ busy: true, step: 'Creating appointment' });
    //   const apptRes = await api.bookAppointment(doctor.id, selectedDate, selectedTime);
    //   if (apptRes.error) throw new Error(apptRes.error);

    //   setBooking({ busy: true, step: 'Processing payment' });
    //   const payRes = await api.initiatePayment(apptRes.data.id);
    //   if (payRes.error) throw new Error(payRes.error);

    //   setBooking({ busy: true, step: 'Starting AI voice agent' });
    //   const aiRes = await api.triggerAIVoiceForAppointment(apptRes.data.id);
    //   if (aiRes.error) throw new Error(aiRes.error);

    //   Alert.alert('Success', 'Your appointment is confirmed and AI agent has been initiated.');
    //   setBooking({ busy: false });
    //   // Optionally navigate to Appointments tab
    //   navigation.getParent()?.navigate?.('Appointments');
    // } catch (e: any) {
    //   Alert.alert('Error', e?.message ?? 'Something went wrong');
    //   setBooking({ busy: false });
    // }
        // Make phone call to clinic/doctor
    const phoneNumber = doctor.phone || '+918080419583'; // Use doctor's phone or default
    const telUrl = `tel:${phoneNumber}`;
    
    Linking.openURL(telUrl).catch(() =>
      Alert.alert('Error', 'Unable to make a call. Please try again.')
    );
  };

  if (loading || !doctor) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View style={{ padding: 16 }}>
            <View style={styles.header}>
              <View style={styles.avatarLarge} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{doctor.name}</Text>
                <Text style={styles.qual}>{doctor.qualification} • {doctor.experience} yrs</Text>
                <Text style={styles.subtle}>{doctor.clinicAddress}</Text>
                <Text style={styles.meta}>⭐ {doctor.rating.toFixed(1)} ({doctor.reviewsCount}) • {doctor.totalBookings} bookings</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Specializations</Text>
            {/* <Text>{doctor.specialization.join(', ')}</Text> */}

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Availability</Text>
            <FlatList
              horizontal
              data={dates}
              keyExtractor={(d) => d}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { setSelectedDate(item); setSelectedTime(null); }}
                  style={[styles.datePill, selectedDate === item && styles.datePillActive]}
                >
                  <Text style={[styles.datePillText, selectedDate === item && styles.datePillTextActive]}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text>No available dates.</Text>}
            />

            {/* <View style={styles.slotsWrap}>
              {slots?.map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectedTime(s)}
                  style={[styles.slot, selectedTime === s && styles.slotActive]}
                >
                  <Text style={[styles.slotText, selectedTime === s && styles.slotTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
              {!slots?.length && <Text style={{ color: '#6B7280' }}>No time slots available.</Text>}
            </View> */}

            <TouchableOpacity
              onPress={onBook}
              disabled={booking.busy}
              style={[styles.bookCta, booking.busy && { opacity: 0.7 }]}>
              <Text style={styles.bookCtaText}>{booking.busy ? (booking.step ?? 'Processing...') : (user ? 'Book Appointment' : 'Login to Book')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 12 },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E5E7EB' },
  name: { fontSize: 18, fontWeight: '800', color: '#111827' },
  qual: { marginTop: 2, color: '#111827', fontWeight: '500' },
  subtle: { color: '#6B7280' },
  meta: { color: '#374151', marginTop: 4 },
  sectionTitle: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#111827' },
  datePill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: '#E5E7EB', marginRight: 8, backgroundColor: '#fff' },
  datePillActive: { backgroundColor: '#EEF2FF', borderColor: '#4338CA' },
  datePillText: { color: '#111827', fontWeight: '600' },
  datePillTextActive: { color: '#4338CA' },
  slotsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  slot: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  slotActive: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  slotText: { color: '#111827', fontWeight: '600' },
  slotTextActive: { color: '#065F46' },
  bookCta: { backgroundColor: '#4F46E5', height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  bookCtaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default DoctorDetailScreen;
