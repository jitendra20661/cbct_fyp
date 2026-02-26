import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export type CategoryCardProps = {
  name: string;
  icon?: string;
  onPress?: () => void;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon = 'local-hospital', onPress }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={40} color="#4F46E5" />
      </View>
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
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#111827',
  },
});

export default CategoryCard;
