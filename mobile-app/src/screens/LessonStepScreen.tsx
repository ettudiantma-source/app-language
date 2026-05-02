import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import api from '../services/api';
import { useApp } from '../context/AppContext';

export default function LessonStepScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useApp();
  const { lessonId, stepId, stepNumber } = route.params;

  const [step, setStep] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [translation, setTranslation] = useState<{ text: string; translation: string } | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    api.get(`/lessons/${lessonId}/steps/${stepNumber}`)
      .then(({ data }) => setStep(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleTapTranslate(text: string) {
    try {
      const { data } = await api.post('/translate', { text, target_lang: user?.native_language || 'fr' });
      setTranslation({ text, translation: data.translation });
      setTimeout(() => setTranslation(null), 5000);
    } catch {}
  }

  function handleSpeak(text: string, lang: string) {
    const voiceMap: Record<string, string> = { DE: 'de-DE', EN: 'en-GB', FR: 'fr-FR', ES: 'es-ES', IT: 'it-IT' };
    Speech.speak(text, { language: voiceMap[lang] || lang, rate: 0.85 });
  }

  async function handleComplete() {
    let finalScore = 100;
    if (step.step_type === 'exercise' || step.step_type === 'final_quiz') {
      const questions = step.content?.questions || [];
      const correct = questions.filter((q: any, i: number) => answers[i] === q.correct_answer).length;
      finalScore = Math.round((correct / questions.length) * 100);
    }

    await api.post(`/lessons/${lessonId}/steps/${stepId}/complete`, { score: finalScore });

    if (step.step_type === 'final_quiz') {
      setScore(finalScore);
      setSubmitted(true);
    } else {
      navigation.goBack();
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F46E5" />;
  if (!step) return null;

  const content = step.content || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>← Back</Text></TouchableOpacity>
        <Text style={styles.stepType}>{step.step_type?.replace('_', ' ')}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        <Text style={styles.title}>{step.title}</Text>

        {step.step_type === 'grammar_rule' && (
          <>
            <Text style={styles.definition}>{content.definition}</Text>
            {content.examples?.map((ex: string, i: number) => (
              <View key={i} style={styles.exampleRow}>
                <TouchableOpacity onLongPress={() => handleTapTranslate(ex)} style={styles.exampleText}>
                  <Text style={styles.example}>{ex}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSpeak(ex, 'DE')}><Text>🔊</Text></TouchableOpacity>
              </View>
            ))}
            {content.table && (
              <View style={styles.table}>
                {content.table.map((row: string[], i: number) => (
                  <View key={i} style={styles.tableRow}>
                    {row.map((cell, j) => <Text key={j} style={styles.tableCell}>{cell}</Text>)}
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {(step.step_type === 'exercise' || step.step_type === 'final_quiz') && (
          <>
            {content.questions?.map((q: any, i: number) => (
              <View key={i} style={styles.question}>
                <Text style={styles.questionText}>{i + 1}. {q.question}</Text>
                {q.options?.map((opt: string) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.option, answers[i] === opt && styles.optionSelected]}
                    onPress={() => !submitted && setAnswers({ ...answers, [i]: opt })}
                  >
                    <Text style={[styles.optionText, answers[i] === opt && styles.optionTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}

        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
          <Text style={styles.completeBtnText}>
            {step.step_type === 'grammar_rule' ? "Got it, next step →" : "Submit answers"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {translation && (
        <View style={styles.translatePopup}>
          <Text style={styles.translateSource}>{translation.text}</Text>
          <Text style={styles.translateArrow}>↓</Text>
          <Text style={styles.translateResult}>{translation.translation}</Text>
        </View>
      )}

      <Modal visible={submitted} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>{score >= 70 ? '🎉' : '😔'}</Text>
            <Text style={styles.modalTitle}>{score >= 70 ? 'Lesson Complete!' : 'Not quite...'}</Text>
            <Text style={styles.modalScore}>{score}%</Text>
            <Text style={styles.modalSubtitle}>{score >= 70 ? 'Great job! Keep going.' : 'You need 70% to pass. Try again!'}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={() => { setSubmitted(false); navigation.goBack(); }}>
              <Text style={styles.modalBtnText}>{score >= 70 ? 'Back to Lesson' : 'Try Again'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  back: { color: '#4F46E5', fontWeight: '600', fontSize: 16 },
  stepType: { color: '#6B7280', textTransform: 'capitalize', fontWeight: '600' },
  scroll: { flex: 1 },
  body: { padding: 24, paddingBottom: 48, gap: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  definition: { fontSize: 16, color: '#374151', lineHeight: 24, backgroundColor: '#EEF2FF', borderRadius: 10, padding: 14 },
  exampleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exampleText: { flex: 1 },
  example: { fontSize: 16, color: '#1F2937', fontStyle: 'italic' },
  table: { borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableCell: { flex: 1, padding: 10, fontSize: 14, color: '#374151' },
  question: { backgroundColor: '#fff', borderRadius: 14, padding: 16, gap: 10 },
  questionText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  option: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, padding: 12 },
  optionSelected: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  optionText: { fontSize: 15, color: '#374151' },
  optionTextSelected: { color: '#4F46E5', fontWeight: '600' },
  completeBtn: { backgroundColor: '#4F46E5', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  completeBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  translatePopup: { position: 'absolute', bottom: 40, left: 24, right: 24, backgroundColor: '#1F2937', borderRadius: 14, padding: 16, alignItems: 'center' },
  translateSource: { color: '#fff', fontWeight: '700', fontSize: 16 },
  translateArrow: { color: '#9CA3AF', fontSize: 16 },
  translateResult: { color: '#FCD34D', fontStyle: 'italic', fontSize: 16 },
  modal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', width: '80%' },
  modalEmoji: { fontSize: 60, marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  modalScore: { fontSize: 48, fontWeight: 'bold', color: '#4F46E5', marginVertical: 8 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  modalBtn: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, marginTop: 20 },
  modalBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
