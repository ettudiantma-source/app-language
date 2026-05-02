import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useApp } from '../context/AppContext';
import api from '../services/api';

export default function ProfileScreen() {
  const { user, subscription, isPremium, logout } = useApp();

  async function handleManageSubscription() {
    try {
      const { data } = await api.post('/subscriptions/portal');
      Linking.openURL(data.url);
    } catch {
      Alert.alert('Error', 'Could not open subscription portal');
    }
  }

  async function handleLogout() {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.full_name?.[0]?.toUpperCase()}</Text></View>
        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {isPremium && <View style={styles.premiumBadge}><Text style={styles.premiumText}>Premium</Text></View>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        {subscription ? (
          <>
            <Text style={styles.subStatus}>Status: {subscription.status}</Text>
            {subscription.current_period_end && (
              <Text style={styles.subDate}>Renews: {new Date(subscription.current_period_end).toLocaleDateString()}</Text>
            )}
            <TouchableOpacity style={styles.manageBtn} onPress={handleManageSubscription}>
              <Text style={styles.manageBtnText}>Manage Subscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noSub}>No active subscription</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { alignItems: 'center', backgroundColor: '#4F46E5', paddingTop: 60, paddingBottom: 32 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 30, fontWeight: 'bold', color: '#4F46E5' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  email: { fontSize: 14, color: '#C7D2FE', marginTop: 2 },
  premiumBadge: { backgroundColor: '#F59E0B', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginTop: 8 },
  premiumText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  section: { margin: 24, backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  subStatus: { fontSize: 15, color: '#374151', textTransform: 'capitalize' },
  subDate: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  noSub: { fontSize: 15, color: '#6B7280' },
  manageBtn: { backgroundColor: '#EEF2FF', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12 },
  manageBtnText: { color: '#4F46E5', fontWeight: '600' },
  logoutBtn: { marginHorizontal: 24, backgroundColor: '#FEE2E2', borderRadius: 12, padding: 16, alignItems: 'center' },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
});
