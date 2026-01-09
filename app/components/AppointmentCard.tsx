import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Appointment } from '../types';

export type AppointmentCardProps = {
  appointment: Appointment;
  right?: React.ReactNode;
};

const Pill: React.FC<{ text: string; color: string; bg: string }> = ({ text, color, bg }) => (
  <View style={[styles.pill, { backgroundColor: bg }]}>
    <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{text}</Text>
  </View>
);

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, right }) => {
  const statusColor = appointment.status === 'Confirmed' ? '#065F46' : appointment.status === 'Completed' ? '#1F2937' : '#92400E';
  const statusBg = appointment.status === 'Confirmed' ? '#D1FAE5' : appointment.status === 'Completed' ? '#E5E7EB' : '#FEF3C7';

  const payColor = appointment.paymentStatus === 'Paid' ? '#1D4ED8' : appointment.paymentStatus === 'Pending' ? '#92400E' : '#991B1B';
  const payBg = appointment.paymentStatus === 'Paid' ? '#DBEAFE' : appointment.paymentStatus === 'Pending' ? '#FEF3C7' : '#FEE2E2';

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{appointment.doctorName}</Text>
        <Text style={styles.subtle}>{appointment.category}</Text>
        <Text style={styles.when}>{appointment.date} • {appointment.timeSlot}</Text>
        <View style={styles.pillsRow}>
          <Pill text={appointment.status} color={statusColor} bg={statusBg} />
          <Pill text={appointment.paymentStatus} color={payColor} bg={payBg} />
        </View>
      </View>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 16,
  },
  subtle: {
    color: '#6B7280',
  },
  when: {
    marginTop: 6,
    color: '#111827',
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default AppointmentCard;
