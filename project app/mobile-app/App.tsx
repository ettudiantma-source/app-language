import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { AppProvider, useApp } from './src/context/AppContext';
import AuthScreen from './src/screens/AuthScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LanguageChoiceScreen from './src/screens/LanguageChoiceScreen';
import PlacementTestScreen from './src/screens/PlacementTestScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import LessonScreen from './src/screens/LessonScreen';
import LessonStepScreen from './src/screens/LessonStepScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PremiumScreen from './src/screens/PremiumScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#4F46E5' }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Learn', tabBarIcon: () => null }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile', tabBarIcon: () => null }} />
    </Tab.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="Lesson" component={LessonScreen} />
      <Stack.Screen name="LessonStep" component={LessonStepScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useApp();
  const [onboarded, setOnboarded] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  if (!user) return <AuthScreen />;
  if (!onboarded) return <OnboardingScreen onDone={() => setOnboarded(true)} />;
  if (!selectedLang) return <LanguageChoiceScreen onSelect={(lang) => setSelectedLang(lang)} />;
  if (!level) return <PlacementTestScreen language={selectedLang} onComplete={(lvl) => setLevel(lvl)} />;

  return <AppStackNavigator />;
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
