import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../services/api';

const FloatingAIButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onPress = async () => {
    try {
      setLoading(true);
      const res = await api.triggerAIQuick();
      if (!res.error) {
        // For now just show a subtle toast-like indicator
        // In production, you may navigate to a dedicated AI chat/voice screen
      }
    } finally {
      setTimeout(() => setLoading(false), 700);
    }
  };

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.button}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.label}>Chat with AI</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // keep above tab bar
    right: 20,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default FloatingAIButton;
