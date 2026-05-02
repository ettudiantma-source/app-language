# 📘 CAHIER DES CHARGES COMPLET
## Application Mobile d'Apprentissage des Langues

---

**Version :** 1.0  
**Date :** Mai 2026  
**Document préparé pour :** Le porteur de projet  
**Type d'application :** Application mobile (iOS + Android)  
**Modèle économique :** Freemium (A1+A2 gratuit · B1+B2 premium)

---

## 📑 TABLE DES MATIÈRES

1. [Présentation du projet](#1-présentation-du-projet)
2. [Objectifs et public cible](#2-objectifs-et-public-cible)
3. [Périmètre fonctionnel](#3-périmètre-fonctionnel)
4. [Catalogue de contenu](#4-catalogue-de-contenu)
5. [Rôles et permissions](#5-rôles-et-permissions)
6. [Parcours utilisateur](#6-parcours-utilisateur)
7. [Spécifications fonctionnelles détaillées](#7-spécifications-fonctionnelles-détaillées)
8. [Architecture technique](#8-architecture-technique)
9. [Schéma de base de données](#9-schéma-de-base-de-données)
10. [API REST – Endpoints](#10-api-rest--endpoints)
11. [Modèle économique et paiements](#11-modèle-économique-et-paiements)
12. [Sécurité et conformité](#12-sécurité-et-conformité)
13. [Performance et qualité](#13-performance-et-qualité)
14. [Plan de développement](#14-plan-de-développement)
15. [Budget prévisionnel](#15-budget-prévisionnel)
16. [Livrables](#16-livrables)
17. [Maintenance et évolution](#17-maintenance-et-évolution)
18. [Annexes](#18-annexes)

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte

Le projet vise à créer une **application mobile multilingue** permettant à des apprenants autonomes d'apprendre une langue étrangère à leur rythme, depuis leur smartphone, à travers un parcours pédagogique structuré, des exercices interactifs et un système de traduction instantanée.

L'application se positionne comme une alternative moderne aux méthodes classiques (livres, cours en présentiel) en intégrant les meilleures pratiques pédagogiques (CECRL, audio natif, gamification) et les technologies actuelles (synthèse vocale, traduction automatique, paiement intégré).

### 1.2 Vision

Devenir l'application de référence pour l'apprentissage autonome des langues européennes, accessible à tous, avec un modèle freemium permettant à chacun de commencer gratuitement.

### 1.3 Valeur ajoutée

- **5 langues** couvertes : Allemand, Anglais, Français, Espagnol, Italien
- **494 leçons structurées** sur 4 niveaux CECRL (A1, A2, B1, B2)
- **Tap-to-translate** instantané : un clic suffit pour traduire n'importe quel mot ou phrase
- **Audio natif TTS** pour chaque leçon (synthèse vocale haute qualité)
- **Test de placement** intelligent pour positionner l'apprenant
- **Mode hors-ligne** : téléchargement des leçons pour apprendre sans connexion
- **Modèle freemium juste** : niveaux débutants entièrement gratuits

---

## 2. OBJECTIFS ET PUBLIC CIBLE

### 2.1 Objectifs principaux

| Objectif | Mesure de succès |
|----------|------------------|
| Permettre l'apprentissage autonome | 70% des utilisateurs complètent au moins 5 leçons |
| Engagement quotidien | Streak moyen > 4 jours |
| Conversion freemium → premium | Taux de conversion > 5% à 30 jours |
| Rétention | 40% d'utilisateurs actifs à 30 jours |
| Satisfaction | Note App Store > 4,5/5 |

### 2.2 Public cible

#### Persona principal : Adulte autodidacte (25-45 ans)
- **Profil** : professionnel, étudiant, voyageur
- **Besoin** : apprendre ou réviser une langue à son rythme
- **Frustration** : manque de temps, applications trop ludiques, prix élevés
- **Attente** : contenu structuré, sérieux, accessible mobile

#### Personas secondaires
- **Étudiants 15-24 ans** : préparation d'examens (Goethe, Cambridge, DELF)
- **Seniors 50+** : reprise d'une langue apprise jeune
- **Expatriés** : apprendre la langue du pays d'accueil

### 2.3 Marchés visés

- **Phase 1** : Maroc, France, pays francophones (interface française)
- **Phase 2** : Espagne, Italie, Allemagne (interface localisée)
- **Phase 3** : monde arabe, anglo-saxon

---

## 3. PÉRIMÈTRE FONCTIONNEL

### 3.1 Fonctionnalités INCLUSES dans la V1.0

#### Fonctionnalités utilisateur
- ✅ Inscription / Connexion (email + mot de passe)
- ✅ Réinitialisation de mot de passe
- ✅ Sélection de la langue cible et de la langue maternelle
- ✅ Test de placement avec 4 types de questions
- ✅ Choix manuel du niveau (alternative au test)
- ✅ Tableau de bord personnalisé avec progression
- ✅ Lecture des leçons par étapes séquentielles
- ✅ Tap-to-translate dans la langue maternelle de l'utilisateur
- ✅ Audio TTS natif sur chaque mot/phrase
- ✅ Exercices interactifs avec correction immédiate
- ✅ Quiz final par leçon
- ✅ Suivi de progression (% complétion, scores)
- ✅ Système de streak (jours consécutifs)
- ✅ Profil utilisateur avec statistiques
- ✅ Achat d'abonnement Premium via Stripe
- ✅ Annulation d'abonnement (Stripe Customer Portal)
- ✅ Téléchargement hors-ligne des leçons (Premium)

#### Fonctionnalités administrateur
- ✅ Connexion avec rôle admin
- ✅ Tableau de bord admin (KPIs)
- ✅ Gestion CRUD des leçons
- ✅ Gestion CRUD des étapes (règles, exercices, quiz)
- ✅ Gestion des utilisateurs (recherche, suspension, activation)
- ✅ Gestion des abonnements
- ✅ Logs d'audit (qui a fait quoi)

### 3.2 Fonctionnalités EXCLUES de la V1.0 (versions futures)

- ❌ Algorithme de répétition espacée (SRS) → V2
- ❌ Reconnaissance vocale (correction de prononciation) → V2
- ❌ Mode social (amis, classements) → V2
- ❌ Conversation IA libre → V3
- ❌ Cours en direct avec professeur → V3
- ❌ Notifications push avancées (rappels intelligents) → V1.1
- ❌ Partage social des progrès → V2

---

## 4. CATALOGUE DE CONTENU

### 4.1 Vue d'ensemble

L'application contient **494 leçons** réparties sur 5 langues × 4 niveaux CECRL :

| Langue | A1 | A2 | B1 | B2 | Total | Free | Premium |
|--------|-----|-----|-----|-----|-------|------|---------|
| 🇩🇪 Deutsch | 18 | 40 | 36 | 34 | **128** | 58 | 70 |
| 🇬🇧 English | 26 | 18 | 10 | 24 | **78** | 44 | 34 |
| 🇫🇷 Français | 42 | 27 | 16 | 20 | **105** | 69 | 36 |
| 🇪🇸 Spanish | 25 | 24 | 23 | 20 | **92** | 49 | 43 |
| 🇮🇹 Italian | 25 | 24 | 22 | 20 | **91** | 49 | 42 |
| **TOTAL** | **136** | **133** | **107** | **118** | **494** | **269** | **225** |

### 4.2 Structure d'une leçon

Chaque leçon est découpée en **étapes séquentielles** dont le nombre s'adapte au sujet (entre 4 et 10 étapes typiquement) :

```
LEÇON
├── Étape 01 : Règle de grammaire (📖)
│   └── Définition + exemples + tableau grammatical + tap-to-translate
├── Étape 02 : Exercice 1 (📋)
│   └── Questions à choix multiples avec correction immédiate
├── Étape 03 : Exercice 2 (📋)
├── Étape 04 : Exercice 3 (📋)
│   ...
└── Étape N : Quiz final (🏆)
    └── 5-10 questions récapitulatives, score final
```

### 4.3 Modèle d'accès freemium

| Niveau | Accès | Justification |
|--------|-------|---------------|
| **A1** Débutant | 🆓 Gratuit | Acquisition utilisateurs, premier contact |
| **A2** Élémentaire | 🆓 Gratuit | Démonstration de la valeur, fidélisation |
| **B1** Intermédiaire | 💎 Premium | Niveau où l'utilisateur est engagé |
| **B2** Avancé | 💎 Premium | Public le plus motivé, à convertir |

### 4.4 Types de contenu par étape

#### 4.4.1 Étape de type "Règle de grammaire"
- **Définition** : explication claire de la règle (1-3 phrases)
- **Exemples** : 3-6 phrases illustrant la règle
- **Tableau grammatical** : structuré (mot / forme / usage)
- **Cas particuliers** : exceptions ou nuances
- **Audio TTS** : disponible sur chaque exemple
- **Tap-to-translate** : sur tout élément du contenu

#### 4.4.2 Étape de type "Exercice"
- **3 à 5 questions** par étape
- **Types** :
  - QCM (4 options, 1 bonne réponse)
  - Fill-in-the-blank (compléter la phrase)
  - Vrai/Faux avec justification
- **Correction immédiate** : ✓ ou ✗ avec explication
- **Score progressif** : compté pour le score global

#### 4.4.3 Étape de type "Quiz final"
- **8 à 10 questions** mélangées
- **Tous les types de questions** des exercices précédents
- **Score affiché** en pourcentage
- **Score minimum 70%** pour validation de la leçon
- **Possibilité de refaire** le quiz

---

## 5. RÔLES ET PERMISSIONS

### 5.1 Utilisateur standard

| Action | Autorisé |
|--------|----------|
| Créer un compte | ✅ |
| Se connecter / déconnecter | ✅ |
| Modifier son profil | ✅ |
| Voir les leçons gratuites (A1/A2) | ✅ |
| Voir les leçons premium (B1/B2) | ✅ Si abonné |
| Faire le test de placement | ✅ |
| Compléter les exercices et quiz | ✅ |
| Télécharger les leçons hors-ligne | ✅ Si abonné |
| Souscrire un abonnement | ✅ |
| Annuler son abonnement | ✅ |
| Voir sa progression | ✅ |

### 5.2 Administrateur

L'admin a **accès complet** à la gestion de l'application, en plus de tous les droits utilisateur.

| Action | Autorisé |
|--------|----------|
| Voir le tableau de bord admin | ✅ |
| Créer / modifier / supprimer des leçons | ✅ |
| Créer / modifier / supprimer des étapes | ✅ |
| Importer des contenus (PDF, JSON) | ✅ |
| Gérer les utilisateurs (rechercher, suspendre, activer) | ✅ |
| Voir tous les abonnements | ✅ |
| Consulter les logs d'audit | ✅ |
| Promouvoir un utilisateur en admin (super_admin uniquement) | ✅ |

### 5.3 Super-administrateur

Identique à l'administrateur, avec en plus la capacité de **gérer d'autres administrateurs**.

---

## 6. PARCOURS UTILISATEUR

### 6.1 Parcours d'inscription et onboarding

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Écran de bienvenue                                       │
│    "Bienvenue ! Apprenez en 3 étapes simples"               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Création de compte (email + mot de passe + nom)          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Choix de la langue cible                                 │
│    🇩🇪 🇬🇧 🇫🇷 🇪🇸 🇮🇹                                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Question : connaissez-vous votre niveau ?                │
└─────────────────────────────────────────────────────────────┘
              ↓                    ↓                ↓
        ┌──────────┐         ┌──────────┐    ┌──────────┐
        │ Oui      │         │ Test     │    │ Débutant │
        │ → Manuel │         │ 10 Q.    │    │ → A1     │
        └──────────┘         └──────────┘    └──────────┘
              ↓                    ↓                ↓
                    ┌────────────────────┐
                    │ 5. Niveau attribué │
                    └────────────────────┘
                              ↓
                    ┌────────────────────┐
                    │ 6. Tableau de bord │
                    │    Apprentissage   │
                    └────────────────────┘
```

### 6.2 Parcours d'apprentissage d'une leçon

```
Tableau de bord
      ↓
Sélection d'une leçon
      ↓
┌──────────────────────────────────────┐
│ Vue séquentielle des étapes          │
│ 01 ✓ Règle (verrouille jusqu'à      │
│ 02 ✓ Exercice 1   complétion)       │
│ 03 → Exercice 2 (étape courante)    │
│ 04 🔒 Exercice 3                    │
│ 05 🔒 Quiz final                    │
└──────────────────────────────────────┘
      ↓
Étape 1 : Lecture de la règle
  - Tap sur n'importe quel mot pour traduire
  - Bouton 🔊 pour écouter l'audio
  - Bouton "J'ai compris, exercice →"
      ↓
Étapes 2-N : Exercices
  - Question affichée
  - Choix d'une réponse
  - Feedback immédiat ✓/✗
  - Question suivante
      ↓
Quiz final : 8-10 questions
  - Score calculé
  - Si ≥ 70% → leçon complétée
  - Si < 70% → possibilité de refaire
      ↓
Retour au tableau de bord
  + Mise à jour streak +1 jour
  + Marquage de la leçon ✓
```

### 6.3 Parcours d'abonnement Premium

```
Utilisateur clique sur leçon B1/B2 (locked)
      ↓
Écran Premium
  - Hero : "Débloquez tout le potentiel"
  - Plans : Mensuel 9,99€ | Annuel 79,99€ (Save 33%)
  - Liste des features
  - Bouton "Essai gratuit 7 jours"
      ↓
Stripe Checkout (browser/in-app)
  - Saisie carte bancaire
  - Confirmation
      ↓
Webhook Stripe → Backend met à jour subscription
      ↓
Retour à l'app
  - Toutes les leçons B1/B2 débloquées
  - Plan Premium affiché dans le profil
```

---

## 7. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

### 7.1 Test de placement

**Objectif** : positionner automatiquement l'utilisateur sur le bon niveau (A1/A2/B1/B2) en 10 questions.

#### Composition du test
- **10 questions** par langue
- **Difficulté progressive** : A1 → A2 → B1 → B2
- **4 types de questions** mixés :
  - 📝 Grammaire (4 questions) : fill-in-the-blank
  - 📚 Vocabulaire (1 question) : traduction de mot
  - 🎧 Audio (3 questions) : écoute + choix
  - 💬 Compréhension (2 questions) : traduction de phrase

#### Algorithme de scoring
- **0-3 bonnes réponses** → A1 (Débutant)
- **4-5 bonnes réponses** → A2 (Élémentaire)
- **6-7 bonnes réponses** → B1 (Intermédiaire)
- **8-10 bonnes réponses** → B2 (Avancé)

#### Affichage des résultats
- Score global : X/10
- Niveau attribué : A1/A2/B1/B2
- Détail par catégorie : grammaire, vocabulaire, audio, compréhension

### 7.2 Tap-to-translate

**Principe** : un appui (court) sur n'importe quel mot ou phrase de la langue cible affiche une popup avec la traduction dans la langue maternelle de l'utilisateur.

#### Comportement
1. Utilisateur tap sur un mot/phrase
2. Popup s'affiche avec :
   - Le mot/phrase en langue cible (gras)
   - Une flèche ↓
   - La traduction (italique, couleur ambre)
   - Bouton 🔊 pour écouter
3. Auto-fermeture après **5 secondes** ou clic ailleurs

#### Langue de traduction
- **Auto-détectée** depuis le profil utilisateur (`native_language`)
- **Modifiable** via un sélecteur en haut à droite
- **Langues disponibles** : FR, EN, AR, ES, IT, DE

#### Cache
- Les traductions sont **mises en cache** côté serveur (table `translation_cache`)
- Performance : appels Google Translate API évités si déjà traduit
- Compteur de "hits" pour identifier les traductions populaires

### 7.3 Audio TTS (Text-to-Speech)

#### Sources audio
- **Synthèse vocale native** via `expo-speech` (gratuite, locale)
- **Voix par langue** :
  - Allemand : `de-DE`
  - Anglais : `en-GB`
  - Français : `fr-FR`
  - Espagnol : `es-ES`
  - Italien : `it-IT`
- **Vitesse** : 0.85x (légèrement ralentie pour apprenants)

#### Évolution future
- **Phase 2** : audio professionnel via Google Cloud TTS ou ElevenLabs
- Stockage S3 + CDN pour performance
- Voix natives masculines + féminines au choix

### 7.4 Système de streak

**Définition** : nombre de jours consécutifs où l'utilisateur a complété au moins une étape.

#### Règles
- +1 jour à la première étape complétée du jour
- Réinitialisé à 1 si > 1 jour d'inactivité
- Affiché en permanence dans le header (🔥 X)
- Record personnel (`longest_streak`) sauvegardé

#### Notifications de rappel (V1.1)
- 19h heure locale : "Ne perdez pas votre streak !"
- 23h si pas de leçon faite : "Dernière chance pour aujourd'hui"

---

## 8. ARCHITECTURE TECHNIQUE

### 8.1 Vue d'ensemble

```
┌─────────────────────┐         ┌──────────────────────┐
│   Mobile App        │ ──────► │   Backend API        │
│   React Native      │         │   Node.js + Express  │
│   + Expo            │ ◄────── │   TypeScript         │
└─────────────────────┘         └──────────┬───────────┘
                                           │
                            ┌──────────────┼──────────────┐
                            ▼              ▼              ▼
                    ┌──────────────┐ ┌─────────┐ ┌───────────────┐
                    │  PostgreSQL  │ │ Stripe  │ │ Google APIs   │
                    │  (Supabase)  │ │ Payment │ │ Translate+TTS │
                    └──────────────┘ └─────────┘ └───────────────┘
```

### 8.2 Stack technique

#### Frontend (Mobile)
- **Framework** : React Native 0.74+
- **Plateforme** : Expo SDK 51+
- **Langage** : TypeScript
- **Navigation** : React Navigation 6 (Stack + Bottom Tabs)
- **State management** : React Context API
- **Stockage local** : AsyncStorage
- **HTTP** : Axios avec intercepteurs (auto-refresh token)
- **Audio** : expo-speech (TTS natif)
- **Styling** : StyleSheet React Native (pas de Tailwind)

#### Backend (API)
- **Runtime** : Node.js 18+
- **Framework** : Express.js 4
- **Base de données** : PostgreSQL 14+ (Supabase ou Railway)
- **Auth** : JWT (jsonwebtoken) + bcrypt
- **Validation** : Joi
- **Rate limiting** : express-rate-limit
- **Sécurité** : Helmet, CORS configuré
- **Paiements** : Stripe SDK
- **Logs** : Morgan + console (puis Sentry)

#### Infrastructure
- **Backend hosting** : Railway, Render, ou AWS Elastic Beanstalk
- **Base de données** : Supabase (free tier) ou Railway PostgreSQL
- **CDN** : Cloudflare (gratuit) pour les assets statiques
- **Mobile builds** : Expo EAS (Expo Application Services)
- **Stores** : Apple App Store + Google Play Store

### 8.3 Structure des dossiers

#### Backend
```
backend/
├── src/
│   ├── server.js              # Point d'entrée
│   ├── db/
│   │   └── index.js           # Pool PostgreSQL
│   ├── middleware/
│   │   ├── auth.js            # Vérification JWT
│   │   └── errorHandler.js    # Gestion d'erreurs globale
│   └── routes/
│       ├── auth.js            # /api/auth/*
│       ├── lessons.js         # /api/lessons/*
│       ├── progress.js        # /api/progress/*
│       ├── placement.js       # /api/placement-test/*
│       ├── translation.js     # /api/translate/*
│       ├── subscriptions.js   # /api/subscriptions/*
│       ├── admin.js           # /api/admin/*
│       └── stripeWebhook.js   # /api/webhooks/stripe
├── package.json
├── .env.example
└── README.md
```

#### Mobile
```
mobile-app/
├── App.tsx                    # Racine + navigation
├── src/
│   ├── context/
│   │   └── AppContext.tsx     # State global
│   ├── services/
│   │   └── api.ts             # Client API (axios)
│   └── screens/
│       ├── AuthScreen.tsx
│       ├── OnboardingScreen.tsx
│       ├── LanguageChoiceScreen.tsx
│       ├── PlacementTestScreen.tsx
│       ├── DashboardScreen.tsx
│       ├── LessonScreen.tsx
│       ├── LessonStepScreen.tsx
│       ├── ProfileScreen.tsx
│       └── PremiumScreen.tsx
├── package.json
└── README.md
```

---

## 9. SCHÉMA DE BASE DE DONNÉES

### 9.1 Vue d'ensemble — 22 tables

```
┌──────────────────── RÉFÉRENCE ────────────────────┐
│  languages   levels   subscription_plans          │
└───────────────────────────────────────────────────┘

┌──────────────────── CONTENU ──────────────────────┐
│  lessons   lesson_steps   quiz_questions          │
│  vocabulary                                        │
└───────────────────────────────────────────────────┘

┌──────────────────── UTILISATEURS ─────────────────┐
│  users   refresh_tokens   password_resets         │
└───────────────────────────────────────────────────┘

┌──────────────────── PROGRESSION ──────────────────┐
│  user_languages   lesson_progress                 │
│  user_step_progress   user_streaks                │
│  quiz_attempts   placement_test_attempts          │
│  user_vocabulary   offline_downloads              │
└───────────────────────────────────────────────────┘

┌──────────────────── PAIEMENTS ────────────────────┐
│  subscriptions   payments                         │
└───────────────────────────────────────────────────┘

┌──────────────────── SYSTÈME ──────────────────────┐
│  notifications   admin_logs   translation_cache   │
└───────────────────────────────────────────────────┘
```

### 9.2 Tables principales

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  native_language VARCHAR(10) DEFAULT 'fr',
  role VARCHAR(20) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `lessons`
```sql
CREATE TABLE lessons (
  id VARCHAR(30) PRIMARY KEY,
  lesson_number INT NOT NULL,
  language_code VARCHAR(2) REFERENCES languages(code),
  level VARCHAR(2) REFERENCES levels(code),
  title TEXT NOT NULL,
  is_free BOOLEAN DEFAULT false,
  access VARCHAR(10) DEFAULT 'free',
  status VARCHAR(20) DEFAULT 'active',
  content JSONB,
  audio_segments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `lesson_steps`
```sql
CREATE TABLE lesson_steps (
  id SERIAL PRIMARY KEY,
  lesson_id VARCHAR(30) REFERENCES lessons(id),
  step_number INT NOT NULL,
  step_type VARCHAR(20),  -- grammar_rule | exercise | final_quiz
  title TEXT,
  icon VARCHAR(10),
  estimated_minutes INT,
  must_complete_before_next BOOLEAN DEFAULT true,
  content JSONB,
  UNIQUE(lesson_id, step_number)
);
```

#### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100) UNIQUE,
  plan_id INT REFERENCES subscription_plans(id),
  status VARCHAR(20),  -- active | trialing | past_due | canceled
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  trial_end TIMESTAMP,
  canceled_at TIMESTAMP
);
```

### 9.3 Vues utiles

```sql
-- Tableau de bord utilisateur
CREATE VIEW v_user_dashboard AS
SELECT u.id, u.full_name, ul.language_code, ul.current_level,
  ul.lessons_completed, us.current_streak
FROM users u
LEFT JOIN user_languages ul ON ul.user_id = u.id
LEFT JOIN user_streaks us ON us.user_id = u.id;

-- Progression dans une leçon
CREATE VIEW v_user_lesson_progress AS
SELECT u.id AS user_id, l.id AS lesson_id,
  COUNT(ls.id) AS total_steps,
  COUNT(CASE WHEN usp.status = 'completed' THEN 1 END) AS completed_steps
FROM users u
CROSS JOIN lessons l
LEFT JOIN lesson_steps ls ON ls.lesson_id = l.id
LEFT JOIN user_step_progress usp ON usp.lesson_step_id = ls.id AND usp.user_id = u.id
GROUP BY u.id, l.id;
```

---

## 10. API REST – ENDPOINTS

### 10.1 Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Créer un compte | ❌ |
| POST | `/login` | Se connecter | ❌ |
| POST | `/refresh` | Renouveler le token | ❌ (refresh token) |
| POST | `/logout` | Se déconnecter | ✅ |
| POST | `/forgot-password` | Demander réinitialisation | ❌ |

### 10.2 Leçons (`/api/lessons`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/?lang=DE&level=A2` | Liste des leçons |
| GET | `/:id` | Détail d'une leçon avec étapes |
| GET | `/:id/steps/:stepNumber` | Détail d'une étape |
| POST | `/:id/steps/:stepId/complete` | Marquer étape complétée |

### 10.3 Progression (`/api/progress`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/dashboard` | Données du tableau de bord |
| GET | `/lesson/:id` | Progression d'une leçon |
| POST | `/quiz` | Soumettre résultat de quiz |
| POST | `/start-language` | Ajouter une langue |

### 10.4 Test de placement (`/api/placement-test`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/:lang` | Récupérer les 10 questions |
| POST | `/submit` | Soumettre les réponses, obtenir le niveau |

### 10.5 Traduction (`/api/translate`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/` | Traduire un texte (avec cache) |
| POST | `/audio` | Générer audio TTS |

### 10.6 Abonnements (`/api/subscriptions`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/plans` | Liste des plans (mensuel, annuel) |
| GET | `/me` | Abonnement actuel de l'utilisateur |
| POST | `/checkout` | Créer une session Stripe Checkout |
| POST | `/cancel` | Annuler à la fin de la période |
| POST | `/portal` | URL du Stripe Customer Portal |

### 10.7 Admin (`/api/admin`)

Toutes les routes admin nécessitent **`role = admin` ou `super_admin`**.

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats` | KPIs globaux |
| GET | `/lessons` | Liste filtrée des leçons |
| POST | `/lessons` | Créer une leçon |
| PUT | `/lessons/:id` | Modifier une leçon |
| DELETE | `/lessons/:id` | Archiver une leçon |
| POST | `/lessons/:id/steps` | Ajouter une étape |
| GET | `/users` | Liste des utilisateurs |
| PUT | `/users/:id/suspend` | Suspendre un utilisateur |
| PUT | `/users/:id/activate` | Réactiver un utilisateur |

### 10.8 Webhooks (`/api/webhooks`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/stripe` | Événements Stripe (subscription, payment) |

---

## 11. MODÈLE ÉCONOMIQUE ET PAIEMENTS

### 11.1 Plans d'abonnement

| Plan | Prix | Engagement | Économie |
|------|------|------------|----------|
| **Mensuel** | 9,99 € / mois | Aucun | — |
| **Annuel** | 79,99 € / an | 1 an | 33% |

### 11.2 Période d'essai

- **Essai gratuit de 7 jours** sur les deux plans
- Carte bancaire requise pour l'inscription
- Annulation possible à tout moment pendant l'essai
- Renouvellement automatique à la fin de l'essai

### 11.3 Fonctionnalités Premium incluses

1. ✅ Accès à toutes les leçons B1 + B2 (235 leçons)
2. ✅ Téléchargement hors-ligne illimité
3. ✅ Exercices avancés et audio premium
4. ✅ Suivi détaillé de progression
5. ✅ Sans publicités

### 11.4 Intégration Stripe

#### Côté utilisateur
- Bouton "Commencer l'essai 7 jours" dans l'app
- Redirection vers **Stripe Checkout** (URL hébergée par Stripe)
- Saisie sécurisée de la carte (PCI DSS conforme)
- Retour à l'app via deep link

#### Côté serveur
- Webhook reçoit les événements Stripe :
  - `checkout.session.completed` → création de l'abonnement
  - `invoice.payment_succeeded` → renouvellement réussi
  - `invoice.payment_failed` → notification + statut `past_due`
  - `customer.subscription.deleted` → annulation
- Synchronisation automatique avec la base `subscriptions`

### 11.5 Gestion des annulations

- Utilisateur clique "Gérer mon abonnement" dans le profil
- Redirection vers **Stripe Customer Portal**
- Annulation au prochain renouvellement
- Conservation de l'accès jusqu'à la fin de la période payée

---

## 12. SÉCURITÉ ET CONFORMITÉ

### 12.1 Sécurité technique

#### Authentification
- ✅ Mots de passe hashés avec **bcrypt** (cost = 12)
- ✅ Tokens JWT avec **rotation des refresh tokens**
- ✅ Refresh tokens hashés en base (SHA-256)
- ✅ Token d'accès court (1h), refresh long (30j)
- ✅ Révocation possible côté serveur

#### Communication
- ✅ HTTPS obligatoire en production (TLS 1.2+)
- ✅ Headers de sécurité via **Helmet**
- ✅ CORS configuré strictement
- ✅ Rate limiting (200 req/15min, 10 sur `/auth`)

#### Données
- ✅ Requêtes paramétrées (protection SQL injection)
- ✅ Validation entrées via **Joi**
- ✅ Sanitization automatique (Express + body-parser)
- ✅ Pas de logs des mots de passe
- ✅ Webhook Stripe signature vérifiée

### 12.2 Conformité RGPD (utilisateurs européens)

- ✅ Consentement explicite à l'inscription
- ✅ Politique de confidentialité accessible
- ✅ CGU acceptées à l'inscription
- ✅ Droit à l'oubli : suppression de compte + données
- ✅ Droit à la portabilité : export JSON sur demande
- ✅ Pas de tracking publicitaire tiers
- ✅ Cookies analytics opt-in

### 12.3 Politique de confidentialité (à rédiger)

Doit couvrir :
1. Quelles données sont collectées (email, nom, progression)
2. Comment elles sont utilisées (apprentissage, recommandations)
3. Avec qui elles sont partagées (Stripe pour paiements, jamais vendues)
4. Combien de temps elles sont conservées
5. Comment l'utilisateur peut les supprimer
6. Coordonnées du DPO

### 12.4 CGU (Conditions Générales d'Utilisation)

À rédiger avec un avocat ou via privacypolicies.com / TermsFeed.

---

## 13. PERFORMANCE ET QUALITÉ

### 13.1 Objectifs de performance

| Métrique | Objectif |
|----------|----------|
| Temps de réponse API moyen | < 200 ms |
| Temps de chargement écran | < 1 s |
| Taille initiale de l'app | < 50 Mo |
| Disponibilité du backend | > 99,5 % |
| Crash rate mobile | < 0,5 % |

### 13.2 Tests

#### Tests automatisés (à mettre en place)
- Tests unitaires backend (Jest) — couverture > 70%
- Tests d'intégration API (Supertest)
- Tests E2E mobile (Detox ou Maestro)

#### Tests manuels avant chaque release
- Parcours complet inscription → leçon → quiz
- Test sur iOS (iPhone 12+) et Android (API 28+)
- Test du tap-to-translate sur 10 langues
- Test de paiement Stripe en mode test

### 13.3 Monitoring (production)

- **Logs serveur** : Railway natif + Logtail
- **Erreurs** : Sentry (backend + mobile)
- **Uptime** : UptimeRobot (gratuit, ping `/health` toutes les 5 min)
- **Analytics** : Mixpanel ou Amplitude (events utilisateurs)

---

## 14. PLAN DE DÉVELOPPEMENT

### 14.1 Phases du projet

#### Phase 0 : Spécification (terminée)
- ✅ Cahier des charges
- ✅ Maquettes UI
- ✅ Architecture technique

#### Phase 1 : Développement V1.0 (terminée)
- ✅ Backend API (8 modules de routes)
- ✅ Application mobile (9 écrans)
- ✅ Base de données complète
- ✅ Catalogue de 494 leçons
- ✅ Test de placement
- ✅ Tap-to-translate
- ✅ Système de paiement Stripe

#### Phase 2 : Déploiement (à venir)
- ⏳ Mise en place infrastructure (Supabase + Railway)
- ⏳ Configuration Stripe production
- ⏳ Tests bêta avec 10 utilisateurs
- ⏳ Soumission Apple App Store
- ⏳ Soumission Google Play Store

#### Phase 3 : Lancement et croissance (mois 1-3 post-launch)
- ⏳ Analytics et tracking
- ⏳ Notifications push
- ⏳ Marketing initial (réseaux, ProductHunt)
- ⏳ Itérations selon retours

#### Phase 4 : Évolutions (mois 4+)
- ⏳ Algorithme SRS (répétition espacée)
- ⏳ Reconnaissance vocale
- ⏳ Gamification (badges, classements)
- ⏳ Mode conversationnel IA
- ⏳ Nouvelles langues (arabe, japonais...)

### 14.2 Roadmap des releases

| Version | Date cible | Contenu |
|---------|-----------|---------|
| **V1.0** | M0 (lancement) | 5 langues, 4 niveaux, parcours complet |
| V1.1 | M+1 | Notifications push, emails transactionnels |
| V1.2 | M+2 | Améliorations UX selon retours users |
| V2.0 | M+4 | SRS + Reconnaissance vocale |
| V2.1 | M+5 | Gamification (badges, streaks avancés) |
| V3.0 | M+8 | Conversation IA, nouvelles langues |

---

## 15. BUDGET PRÉVISIONNEL

### 15.1 Coûts de lancement (one-time)

| Poste | Coût |
|-------|------|
| Apple Developer Program (1 an) | 99 € |
| Google Play Console (one-time) | 25 € |
| Domaine (1 an) | 12 € |
| Politique de confidentialité (générateur) | 0 € |
| Logo et assets visuels (Fiverr/Canva) | 50 € |
| **Total démarrage** | **186 €** |

### 15.2 Coûts mensuels récurrents (estimation pour 1000 utilisateurs actifs)

| Service | Tier | Coût mensuel |
|---------|------|--------------|
| Supabase (PostgreSQL) | Pro | 25 € |
| Railway (Backend) | Hobby | 10 € |
| Cloudflare CDN | Free | 0 € |
| SendGrid (emails) | Essentials | 15 € |
| Google Cloud TTS | À l'usage | 10 € |
| Google Translate API | À l'usage | 15 € |
| Sentry (error tracking) | Team | 25 € |
| Mixpanel (analytics) | Free | 0 € |
| **Total mensuel** | | **~100 €** |

### 15.3 Coûts variables

- **Stripe** : 2,9% + 0,30 € par transaction
  - Sur 100 abonnements à 9,99 € : ~29 € + 30 € = 59 € de commissions
- **Apple/Google** : 15-30% sur les paiements via in-app purchase
  - **Recommandation** : utiliser Stripe (paiement web) pour éviter les 30%

### 15.4 Projection de revenus

| Scénario | Utilisateurs | Conversion | MRR | ARR |
|----------|-------------|-----------|-----|-----|
| Pessimiste | 500 | 3% | 150 € | 1 800 € |
| Réaliste | 2 000 | 5% | 1 000 € | 12 000 € |
| Optimiste | 10 000 | 7% | 7 000 € | 84 000 € |

**Point mort estimé** : ~50 abonnés payants pour couvrir les coûts.

---

## 16. LIVRABLES

### 16.1 Code source

- ✅ `backend_api_complete.tar.gz` — Backend Node.js complet
- ✅ `mobile_app_complete.tar.gz` — App React Native + Expo

### 16.2 Base de données

- ✅ `database_schema_complete.sql` — Schéma principal
- ✅ `database_schema_steps_addition.sql` — Schéma étapes

### 16.3 Contenu pédagogique

- ✅ `master_content_v3.json` — 494 leçons complètes
- ✅ `enhanced_placement.json` — Tests de placement (5 langues)
- ✅ `lesson_structure_v2.json` — Modèle de leçon

### 16.4 Documentation

- ✅ `PROJECT_README.md` — Vue d'ensemble
- ✅ `DEPLOYMENT_GUIDE.md` — Guide de déploiement
- ✅ `whats_next.html` — Plan d'action post-livraison
- ✅ `CAHIER_DES_CHARGES.md` — Le présent document

### 16.5 Maquettes et prototypes

- ✅ `ui_mockups_mobile_v2.html` — 6 écrans mobile
- ✅ `lesson_detail_prototype.html` — Vue leçon
- ✅ `onboarding_prototype_v2.html` — Onboarding + test

---

## 17. MAINTENANCE ET ÉVOLUTION

### 17.1 Plan de maintenance

#### Maintenance corrective
- **Bugs critiques** : correction sous 48h
- **Bugs majeurs** : correction sous 1 semaine
- **Bugs mineurs** : correction au prochain cycle

#### Maintenance évolutive
- **Nouvelles leçons** : ajout mensuel via le panel admin
- **Nouvelles fonctionnalités** : roadmap trimestrielle
- **Mises à jour technique** : tous les 6 mois minimum

### 17.2 Sauvegardes

- **Base de données** : sauvegarde quotidienne automatique (Supabase)
- **Rétention** : 30 jours minimum
- **Test de restauration** : trimestriel

### 17.3 Mises à jour de sécurité

- Audit des dépendances : mensuel (`npm audit`)
- Mise à jour des packages critiques : sous 48h
- Renouvellement des secrets (JWT, API keys) : annuel

---

## 18. ANNEXES

### 18.1 Glossaire

| Terme | Définition |
|-------|------------|
| **CECRL** | Cadre Européen Commun de Référence pour les Langues |
| **CRUD** | Create, Read, Update, Delete |
| **JWT** | JSON Web Token (authentification) |
| **TTS** | Text-to-Speech (synthèse vocale) |
| **SRS** | Spaced Repetition System (répétition espacée) |
| **MRR** | Monthly Recurring Revenue (revenu mensuel récurrent) |
| **ARR** | Annual Recurring Revenue (revenu annuel récurrent) |
| **Streak** | Nombre de jours consécutifs d'activité |

### 18.2 Liens utiles

- **Documentation Expo** : https://docs.expo.dev
- **Documentation Stripe** : https://stripe.com/docs
- **Documentation Supabase** : https://supabase.com/docs
- **CECRL niveaux** : https://www.coe.int/fr/web/common-european-framework-reference-languages
- **Apple App Store guidelines** : https://developer.apple.com/app-store/review/guidelines/
- **Google Play policies** : https://play.google.com/about/developer-content-policy/

### 18.3 Contacts

- **Stripe Support** : https://support.stripe.com
- **Supabase Support** : https://supabase.com/support
- **Railway Support** : https://railway.app/help
- **Apple Developer Support** : https://developer.apple.com/contact/

### 18.4 Estimation détaillée du temps de déploiement

| Étape | Durée |
|-------|-------|
| Création compte Supabase + import schéma | 15 min |
| Création repo GitHub + push backend | 10 min |
| Déploiement Railway + variables d'env | 20 min |
| Configuration Stripe + webhook | 15 min |
| Test backend avec Postman | 20 min |
| Configuration mobile (API URL) | 5 min |
| Test mobile avec Expo Go | 15 min |
| Test parcours complet | 30 min |
| **Total mise en ligne** | **~2h10** |

### 18.5 Critères d'acceptation

L'application sera considérée comme **livrée et acceptée** lorsque :

- ✅ Un utilisateur peut s'inscrire et se connecter
- ✅ Le test de placement attribue un niveau cohérent
- ✅ L'utilisateur peut lire au moins une leçon complète (toutes étapes)
- ✅ Le tap-to-translate fonctionne dans 5 langues
- ✅ L'audio TTS fonctionne pour chaque langue
- ✅ Un utilisateur peut souscrire à un abonnement Premium (mode test)
- ✅ Un admin peut créer/modifier/supprimer une leçon
- ✅ Le backend est déployé et accessible via HTTPS
- ✅ L'app est testable via Expo Go sur iOS et Android

---

## ✍️ SIGNATURES

**Document validé le :** ____________________

**Porteur du projet :** ____________________________  

Signature : ___________________

**Prestataire technique :** ____________________________  

Signature : ___________________

---

*Document généré le 02 mai 2026*  
*Version 1.0 — Cahier des charges complet*  
*© 2026 — Application Langues — Tous droits réservés*
