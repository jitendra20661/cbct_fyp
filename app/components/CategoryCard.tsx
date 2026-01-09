import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type CategoryCardProps = {
  name: string;
  onPress?: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ name, onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.iconPlaceholder} />
      <Text style={styles.label} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
    borderColor: '#eee',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#111827',
  },
});

export default CategoryCard;
