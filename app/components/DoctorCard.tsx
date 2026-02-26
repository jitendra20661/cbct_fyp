import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Doctor } from '../types';

export type DoctorCardProps = {
  doctor: Doctor;
  onPress?: () => void;
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.subtle}>{doctor.location}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>⭐ {doctor.rating.toFixed(1)} ({doctor.reviewsCount})</Text>
        <Text style={styles.meta}>• {doctor.totalBookings} bookings</Text>
      </View>

      {/* <Text style={styles.specialization} numberOfLines={1}>
        {(doctor.specialization ?? []).join(', ') || 'Specialization not available'}
      </Text> */}

      {doctor.availability && (
        <Text style={styles.slots} numberOfLines={1}>
          Next: {Object.values(doctor.availability)[0]?.[0] ?? 'No slots'}
        </Text>
      )}
    </TouchableOpacity>
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
  },
  headerRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  subtle: {
    color: '#6B7280',
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  meta: {
    color: '#374151',
    fontSize: 12,
  },
  specialization: {
    marginTop: 8,
    color: '#111827',
    fontWeight: '500',
  },
  slots: {
    marginTop: 6,
    color: '#374151',
  },
});

export default DoctorCard;
