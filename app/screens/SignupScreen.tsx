import React, { useContext, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { AuthContext } from '../context/AuthContext';

export type SignupScreenProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    try {
      setBusy(true);
      const res = await signup(name.trim(), email.trim(), password);
      if (res.error) Alert.alert('Signup Failed', res.error);
      else navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
        <Text style={styles.title}>Create your account</Text>
        <View style={styles.field}> 
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Jane Doe" style={styles.input} />
        </View>
        <View style={styles.field}> 
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        </View>
        <View style={styles.field}> 
          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry style={styles.input} />
        </View>
        <TouchableOpacity disabled={busy} onPress={onSubmit} style={[styles.cta, busy && { opacity: 0.7 }]}>
          <Text style={styles.ctaText}>{busy ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text>
            Already have an account? <Text onPress={() => navigation.replace('Login')} style={{ color: '#4F46E5', fontWeight: '700' }}>Sign in</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { marginBottom: 6, color: '#374151', fontWeight: '600' },
  input: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 12, height: 48 },
  cta: { marginTop: 8, backgroundColor: '#4F46E5', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#fff', fontWeight: '800' },
});

export default SignupScreen;
