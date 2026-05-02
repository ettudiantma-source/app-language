import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import api from '../services/api';

const LANGUAGES = [
  { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'EN', label: 'English', flag: '🇬🇧' },
  { code: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'ES', label: 'Español', flag: '🇪🇸' },
  { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
];

export default function LanguageChoiceScreen({ onSelect }: { onSelect: (code: string) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Which language do you want to learn?</Text>
      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelect(item.code)}>
            <Text style={styles.flag}>{item.flag}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ gap: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 32, textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 20, gap: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  flag: { fontSize: 36 },
  label: { fontSize: 18, fontWeight: '600', color: '#1F2937' },
});
