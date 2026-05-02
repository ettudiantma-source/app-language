import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useApp } from '../context/AppContext';

export default function AuthScreen() {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        if (!fullName) return Alert.alert('Error', 'Name is required');
        await register(email.trim(), password, fullName.trim());
      }
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>LinguaLearn</Text>
        <Text style={styles.subtitle}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>

        {mode === 'register' && (
          <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
        )}
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <Text style={styles.toggle}>
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4F46E5', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4F46E5', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#4F46E5', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  toggle: { textAlign: 'center', color: '#4F46E5', marginTop: 16, fontSize: 14 },
});
