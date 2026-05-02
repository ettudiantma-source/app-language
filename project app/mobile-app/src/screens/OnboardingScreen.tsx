import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const steps = [
  { title: 'Learn at your pace', desc: '494 structured lessons across 4 CEFR levels', emoji: '📚' },
  { title: 'Tap to translate', desc: 'Tap any word to see an instant translation', emoji: '🔍' },
  { title: 'Track your progress', desc: 'Build daily streaks and measure your growth', emoji: '🔥' },
];

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = React.useState(0);
  const current = steps[step];

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{current.emoji}</Text>
      <Text style={styles.title}>{current.title}</Text>
      <Text style={styles.desc}>{current.desc}</Text>

      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => step < steps.length - 1 ? setStep(step + 1) : onDone()}>
        <Text style={styles.buttonText}>{step < steps.length - 1 ? 'Next' : 'Get Started'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 80, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 12 },
  desc: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E5E7EB' },
  dotActive: { backgroundColor: '#4F46E5', width: 24 },
  button: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 48 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
