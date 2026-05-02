import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { useApp } from '../context/AppContext';

const LEVEL_COLORS: Record<string, string> = { A1: '#10B981', A2: '#3B82F6', B1: '#F59E0B', B2: '#EF4444' };

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user, isPremium } = useApp();
  const [lessons, setLessons] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState('DE');

  useEffect(() => {
    loadData();
  }, [selectedLang]);

  async function loadData() {
    setLoading(true);
    try {
      const [lessonsRes, dashRes] = await Promise.all([
        api.get(`/lessons?lang=${selectedLang}`),
        api.get('/progress/dashboard'),
      ]);
      setLessons(lessonsRes.data);
      setStreak(dashRes.data.user?.current_streak || 0);
    } catch {}
    setLoading(false);
  }

  function renderLesson({ item }: { item: any }) {
    const locked = item.access === 'premium' && !isPremium;
    return (
      <TouchableOpacity
        style={[styles.lessonCard, locked && styles.lockedCard]}
        onPress={() => locked ? navigation.navigate('Premium') : navigation.navigate('Lesson', { lessonId: item.id })}
      >
        <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[item.level] || '#6B7280' }]}>
          <Text style={styles.levelText}>{item.level}</Text>
        </View>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.lessonNumber}>Lesson {item.lesson_number}</Text>
        </View>
        {locked && <Text style={styles.lockIcon}>🔒</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.full_name?.split(' ')[0]} 👋</Text>
          <Text style={styles.streak}>🔥 {streak} day streak</Text>
        </View>
        {isPremium && <View style={styles.premiumBadge}><Text style={styles.premiumText}>Premium</Text></View>}
      </View>

      <View style={styles.langTabs}>
        {['DE', 'EN', 'FR', 'ES', 'IT'].map((lang) => (
          <TouchableOpacity key={lang} style={[styles.langTab, selectedLang === lang && styles.langTabActive]} onPress={() => setSelectedLang(lang)}>
            <Text style={[styles.langTabText, selectedLang === lang && styles.langTabTextActive]}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F46E5" />
      ) : (
        <FlatList data={lessons} keyExtractor={(item) => item.id} renderItem={renderLesson} contentContainerStyle={styles.list} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#4F46E5' },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  streak: { fontSize: 14, color: '#C7D2FE', marginTop: 2 },
  premiumBadge: { backgroundColor: '#F59E0B', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  premiumText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  langTabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  langTab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  langTabActive: { backgroundColor: '#EEF2FF' },
  langTabText: { color: '#6B7280', fontWeight: '600' },
  langTabTextActive: { color: '#4F46E5' },
  list: { padding: 16, gap: 12 },
  lessonCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  lockedCard: { opacity: 0.7 },
  levelBadge: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  levelText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  lessonInfo: { flex: 1 },
  lessonTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  lessonNumber: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  lockIcon: { fontSize: 18 },
});
