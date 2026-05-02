import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import api from '../services/api';

const FEATURES = [
  '✅ All B1 & B2 lessons (225 lessons)',
  '✅ Unlimited offline downloads',
  '✅ Detailed progress tracking',
  '✅ No ads',
];

export default function PremiumScreen({ onBack }: { onBack?: () => void }) {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/subscriptions/plans').then(({ data }) => {
      setPlans(data);
      setSelectedPlan(data[0]?.id);
    });
  }, []);

  async function handleSubscribe() {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      const { data } = await api.post('/subscriptions/checkout', { plan_id: selectedPlan });
      Linking.openURL(data.url);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🚀</Text>
        <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
        <Text style={styles.heroSubtitle}>Start your 7-day free trial today</Text>
      </View>

      <View style={styles.features}>
        {FEATURES.map((f, i) => <Text key={i} style={styles.feature}>{f}</Text>)}
      </View>

      <View style={styles.plans}>
        {plans.map((plan) => (
          <TouchableOpacity key={plan.id} style={[styles.plan, selectedPlan === plan.id && styles.planSelected]} onPress={() => setSelectedPlan(plan.id)}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>€{plan.price_eur}{plan.interval === 'month' ? '/mo' : '/yr'}</Text>
            </View>
            {plan.interval === 'year' && <View style={styles.saveBadge}><Text style={styles.saveText}>Save 33%</Text></View>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.subscribeBtn} onPress={handleSubscribe} disabled={loading}>
        <Text style={styles.subscribeBtnText}>{loading ? 'Loading...' : 'Start Free Trial'}</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>Cancel anytime. No charges during trial.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  hero: { alignItems: 'center', marginBottom: 32 },
  heroEmoji: { fontSize: 60, marginBottom: 12 },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  heroSubtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
  features: { marginBottom: 24, gap: 10 },
  feature: { fontSize: 15, color: '#374151' },
  plans: { gap: 12, marginBottom: 24 },
  plan: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 14, padding: 16 },
  planSelected: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  planName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  planPrice: { fontSize: 20, fontWeight: 'bold', color: '#4F46E5', marginTop: 2 },
  saveBadge: { backgroundColor: '#10B981', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  subscribeBtn: { backgroundColor: '#4F46E5', borderRadius: 14, padding: 18, alignItems: 'center' },
  subscribeBtnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  disclaimer: { textAlign: 'center', color: '#9CA3AF', fontSize: 13, marginTop: 12 },
});
