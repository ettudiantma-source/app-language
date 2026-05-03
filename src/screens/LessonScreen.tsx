import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import api from '../services/api';

const STEP_ICONS: Record<string, string> = { grammar_rule: '📖', exercise: '📋', final_quiz: '🏆' };

export default function LessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/lessons/${lessonId}`),
      api.get(`/progress/lesson/${lessonId}`),
    ]).then(([lessonRes, progressRes]) => {
      setLesson(lessonRes.data);
      setProgress(progressRes.data);
    }).finally(() => setLoading(false));
  }, []);

  function getStepStatus(stepId: number) {
    return progress.find((p) => p.id === stepId)?.status || 'locked';
  }

  function canAccessStep(index: number) {
    if (index === 0) return true;
    const prev = lesson.steps[index - 1];
    return getStepStatus(prev.id) === 'completed';
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F46E5" />;
  if (!lesson) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.levelBadge}>{lesson.level}</Text>
      </View>

      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.meta}>Lesson {lesson.lesson_number} · {lesson.steps?.length || 0} steps</Text>

      <FlatList
        data={lesson.steps}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const status = getStepStatus(item.id);
          const accessible = canAccessStep(index);
          return (
            <TouchableOpacity
              style={[styles.step, !accessible && styles.stepLocked, status === 'completed' && styles.stepDone]}
              disabled={!accessible}
              onPress={() => navigation.navigate('LessonStep', { lessonId, stepId: item.id, stepNumber: item.step_number })}
            >
              <Text style={styles.stepIcon}>{status === 'completed' ? '✅' : accessible ? STEP_ICONS[item.step_type] || '📄' : '🔒'}</Text>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepType}>{item.step_type?.replace('_', ' ')} · ~{item.estimated_minutes} min</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  back: { color: '#4F46E5', fontWeight: '600', fontSize: 16 },
  levelBadge: { backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, fontSize: 13 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', paddingHorizontal: 24, marginBottom: 4 },
  meta: { fontSize: 14, color: '#6B7280', paddingHorizontal: 24, marginBottom: 24 },
  list: { paddingHorizontal: 24, gap: 12 },
  step: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  stepLocked: { opacity: 0.5 },
  stepDone: { borderLeftWidth: 4, borderLeftColor: '#10B981' },
  stepIcon: { fontSize: 24 },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  stepType: { fontSize: 12, color: '#9CA3AF', marginTop: 2, textTransform: 'capitalize' },
});
