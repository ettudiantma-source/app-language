import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import api from '../services/api';

interface Question {
  id: number;
  question_text: string;
  question_type: string;
  options: string[];
  audio_url?: string;
  level: string;
}

export default function PlacementTestScreen({ language, onComplete }: { language: string; onComplete: (level: string) => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ question_id: number; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/placement-test/${language}`)
      .then(({ data }) => setQuestions(data))
      .catch(() => Alert.alert('Error', 'Failed to load test'))
      .finally(() => setLoading(false));
  }, []);

  async function handleAnswer(answer: string) {
    const updated = [...answers, { question_id: questions[current].id, answer }];
    setAnswers(updated);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      try {
        const { data } = await api.post('/placement-test/submit', { language_code: language, answers: updated });
        onComplete(data.level);
      } catch {
        Alert.alert('Error', 'Failed to submit test');
      }
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F46E5" />;
  if (!questions.length) return null;

  const q = questions[current];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{current + 1} / {questions.length}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((current + 1) / questions.length) * 100}%` }]} />
      </View>

      <Text style={styles.level}>Level {q.level}</Text>
      <Text style={styles.question}>{q.question_text}</Text>

      {q.question_type === 'audio' && (
        <TouchableOpacity style={styles.audioBtn} onPress={() => Speech.speak(q.question_text, { language })}>
          <Text style={styles.audioBtnText}>🔊 Listen</Text>
        </TouchableOpacity>
      )}

      <View style={styles.options}>
        {q.options.map((opt) => (
          <TouchableOpacity key={opt} style={styles.option} onPress={() => handleAnswer(opt)}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 24, paddingTop: 60 },
  progress: { textAlign: 'center', color: '#6B7280', marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginBottom: 32 },
  progressFill: { height: 6, backgroundColor: '#4F46E5', borderRadius: 3 },
  level: { fontSize: 12, fontWeight: '600', color: '#4F46E5', textTransform: 'uppercase', marginBottom: 8 },
  question: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  audioBtn: { backgroundColor: '#EEF2FF', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 16 },
  audioBtnText: { color: '#4F46E5', fontWeight: '600' },
  options: { gap: 12 },
  option: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  optionText: { fontSize: 16, color: '#1F2937' },
});
