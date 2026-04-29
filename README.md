# 🗳️ NirvachAI — Election Process Education Assistant

An interactive, AI-powered assistant that educates citizens about the Indian election process through dynamic conversations, visual timelines, quizzes, and personalized learning paths — all powered by Google Services.

![NirvachAI](https://img.shields.io/badge/NirvachAI-Election_Education-FF6B35?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Auth_|_Firestore_|_Analytics_|_Performance_|_RemoteConfig-FFCA28?style=flat-square&logo=firebase)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_Powered-4285F4?style=flat-square&logo=google)

---

## 📌 Chosen Vertical

**Election Process Education** — Helping citizens understand how democracy works through an intelligent, accessible, and engaging AI assistant.

---

## 🎯 Approach & Logic

### Problem Statement
Many citizens, especially first-time voters, lack clear understanding of the election process — from voter registration to government formation. Information is scattered across multiple government websites and documents, making it hard to learn systematically.

### Our Solution
NirvachAI serves as a **single, interactive platform** that consolidates election education into an engaging experience:

1. **AI-Powered Conversations** — Users can ask natural-language questions about elections and receive accurate, context-aware responses powered by Google Gemini AI
2. **Visual Learning** — An interactive 9-stage election timeline breaks down the entire process into digestible steps
3. **Active Assessment** — Categorized quizzes with AI-generated explanations ensure knowledge retention
4. **Practical Guidance** — A voter readiness checklist walks users through registration and preparation
5. **Reference Library** — A searchable encyclopedia of election terms with AI-powered enrichment provides deep understanding
6. **AI Term Enrichment** — Each encyclopedia term can be explained in depth by Gemini AI for deeper understanding

### Decision-Making Logic
- The AI assistant uses a carefully crafted **system prompt** that restricts responses to election education, ensuring factual accuracy and non-partisan content
- The system provides **intelligent fallback responses** when the AI service is unavailable, guaranteeing the app is always educational
- Progress is tracked locally with **LocalStorage** for instant performance and zero-cost operation
- **Firebase Authentication** provides optional Google Sign-In with automatic fallback to local guest mode
- **Firebase Remote Config** enables server-side feature flags without code deployment
- **Firebase Performance Monitoring** tracks Core Web Vitals and custom traces for AI response latency

---

## 🚀 How the Solution Works

### Architecture

```
┌──────────────────────────────────────────────────────┐
│              Frontend (Vite + React 19)                │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────────┐   │
│  │  Pages   │ │Components│ │      Services         │   │
│  │  Home    │ │ Sidebar  │ │ gemini.js (AI)        │   │
│  │  Chat    │ │ Timeline │ │ analytics.js          │   │
│  │  Quiz    │ │ Quiz     │ │ firestoreService.js   │   │
│  │  ...     │ │ Error    │ │ remoteConfig.js       │   │
│  │          │ │ Boundary │ │ performanceService.js  │   │
│  └─────────┘ └──────────┘ └──────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐   │
│  │  Config   │ │  Utils   │ │       Data            │   │
│  │constants │ │validators│ │ electionStages.js     │   │
│  │firebase  │ │formatters│ │ quizQuestions.js      │   │
│  └──────────┘ └──────────┘ └──────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │
     ┌─────────────┼───────────────┬───────────────┐
     ▼             ▼               ▼               ▼
┌────────┐ ┌────────────┐ ┌──────────────┐ ┌──────────┐
│Firebase │ │ Gemini AI  │ │  Firebase    │ │ Firebase │
│  Auth   │ │  (Chat,    │ │  Analytics   │ │ Remote   │
│         │ │  Quiz,     │ │  + Perf Mon  │ │ Config   │
│         │ │  Terms)    │ │              │ │          │
└────────┘ └────────────┘ └──────────────┘ └──────────┘
     ▼             ▼
┌────────┐ ┌────────────┐
│Firestore│ │  Firebase  │
│ (Data)  │ │  Hosting   │
└────────┘ └────────────┘
```

### Features

| Feature | Description | Google Service |
|---------|-------------|----------------|
| 🤖 AI Assistant | Context-aware election Q&A chatbot | Google Gemini AI |
| 🧠 AI Quiz Explanations | Personalized answer explanations | Google Gemini AI |
| 📖 AI Term Enrichment | Deep explanations of election terms | Google Gemini AI |
| 📊 Election Timeline | Interactive 9-stage process visualization | — |
| 🧠 Knowledge Quiz | 25+ categorized questions with AI explanations | Google Gemini AI |
| 📖 Encyclopedia | Searchable glossary with AI-powered "Explain" | Google Gemini AI |
| 📋 Voter Checklist | Step-by-step voter readiness guide | — |
| 🏆 Dashboard | Progress tracking with achievements | — |
| 🔐 Authentication | Google Sign-In + Guest mode | Firebase Auth |
| 📈 Analytics | Custom event tracking (25+ events) | Firebase Analytics |
| ⚡ Performance | Custom traces for AI latency & quiz timing | Firebase Performance |
| 🎛️ Remote Config | Dynamic feature flags & configuration | Firebase Remote Config |
| 💾 Cloud Data | User progress persistence & leaderboard | Cloud Firestore |
| 🌐 Hosting | CDN deployment with security headers | Firebase Hosting |
| ✏️ Typography | Premium fonts (Inter, Outfit) | Google Fonts |

### Tech Stack

| Layer | Technology |
|-------|-----------:|
| Framework | Vite 8 + React 19 |
| Styling | Vanilla CSS with Custom Properties |
| AI | `@google/genai` (Gemini 2.0 Flash) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore (with real-time sync) |
| Analytics | Firebase Analytics (GA4) |
| Performance | Firebase Performance Monitoring |
| Remote Config | Firebase Remote Config |
| Hosting | Firebase Hosting |
| Icons | Lucide React |
| Routing | React Router v7 |
| Fonts | Google Fonts (Inter, Outfit) |
| Testing | Vitest + Testing Library |

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- A Firebase project
- A Google Gemini API key

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/H2SKILL.git
cd H2SKILL

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Firebase and Gemini API keys

# 4. Start development server
npm run dev

# 5. Run tests
npm run test

# 6. Build for production
npm run build
```

### Environment Variables

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-your_measurement_id
VITE_GEMINI_API_KEY=your_gemini_key
```

---

## ✅ Evaluation Criteria Mapping

### 1. Code Quality
- **Modular architecture** — Clean separation: pages, components, services, hooks, utils, config, data
- **Centralized constants** — All magic strings, numbers, and config in `constants.js`
- **Utility modules** — Reusable `validators.js` and `formatters.js` for input handling and display
- **Design system** — Centralized CSS custom properties for consistent theming
- **Code splitting** — React.lazy + Suspense for optimal bundle size
- **JSDoc documentation** — Comprehensive type annotations on all exported functions
- **Named exports** — Clear, descriptive naming throughout
- **useCallback optimization** — Referentially stable callbacks to prevent unnecessary re-renders

### 2. Security
- **Environment variables** — All API keys in `.env`, never committed (`.gitignore`)
- **AI safety filters** — Gemini configured with content safety settings
- **System prompt guardrails** — AI restricted to election education topics only
- **Input validation** — User inputs sanitized through `validators.js` before API calls
- **Safe HTML rendering** — `sanitizeForDisplay()` escapes HTML before applying markdown formatting
- **Rate limiting** — Client-side rate limiter prevents API abuse
- **Content moderation** — `moderateContent()` validates user input safety
- **Firebase Hosting headers** — CSP, HSTS, X-Frame-Options, XSS protection, Permissions-Policy
- **Firestore rules** — User-scoped data access with owner-only write permissions

### 3. Efficiency
- **Vite** — Sub-second HMR, optimized production builds
- **Code splitting** — Lazy-loaded routes reduce initial bundle size
- **LocalStorage** — Zero-latency data persistence, no network round-trips
- **Lazy analytics** — Firebase Analytics initialized only when supported
- **Lazy Firestore** — Firestore functions loaded on-demand
- **Minimal dependencies** — Only 4 production dependencies
- **Fallback responses** — AI works offline with pre-built educational content
- **Remote Config caching** — Cached in localStorage for offline fallback

### 4. Testing
- **16 test files** covering all modules with 100+ test cases
- **Data integrity tests** — Validates all quiz questions, stages, glossary terms, and checklist items
- **Service tests** — Analytics, Gemini, Firestore, Remote Config, Performance
- **Utility tests** — Validators and formatters with edge cases
- **Security tests** — CSP headers, env vars, accessibility checks
- **Constant integrity tests** — Verifies immutability and value correctness
- **Build verification** — `npm run build` passes with zero errors

### 5. Accessibility (WCAG 2.1 AA)
- **Skip navigation** link for keyboard users
- **Semantic HTML** — `<main>`, `<nav>`, `<article>`, `<section>` elements
- **ARIA labels** on all interactive elements
- **Keyboard navigation** — Full tab support with visible focus indicators
- **Color contrast** — ≥ 4.5:1 ratio throughout
- **Reduced motion** — `prefers-reduced-motion` media query support
- **Screen reader** — `aria-live` regions for dynamic content updates
- **High contrast** — `prefers-contrast: high` support
- **Noscript fallback** — Meaningful message for JavaScript-disabled browsers

### 6. Google Services Integration
- **Google Gemini AI** — Powers the intelligent chatbot, quiz explanations, and encyclopedia term enrichment (3 distinct AI features)
- **Firebase Authentication** — Google Sign-In with automatic local guest fallback
- **Cloud Firestore** — User progress persistence with real-time leaderboard sync via `onSnapshot`
- **Firebase Analytics** — 25+ custom events with GA4 screen_view tracking, user engagement metrics
- **Firebase Performance Monitoring** — Custom traces for AI response latency, quiz completion time, term enrichment
- **Firebase Remote Config** — Dynamic feature flags with server-side control and offline fallback
- **Firebase Hosting** — Production deployment with CDN, security headers, and SPA rewrites
- **Google Fonts** — Inter and Outfit for premium typography

---

## 📁 Project Structure

```
├── .env.example          # Environment variables template
├── firebase.json         # Firebase Hosting config (CSP, HSTS)
├── firestore.rules       # Firestore security rules
├── index.html            # Entry HTML with SEO meta tags
├── vite.config.js        # Vite + Vitest configuration
│
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Root component + lazy routing
    ├── index.css          # Design system (800+ lines)
    │
    ├── config/
    │   ├── firebase.js    # Firebase initialization (7 services)
    │   └── constants.js   # Centralized app constants
    │
    ├── contexts/
    │   └── AuthContext.jsx # Auth with Firebase + local fallback
    │
    ├── hooks/
    │   └── useFirestore.js # Data persistence hook (useCallback)
    │
    ├── services/
    │   ├── gemini.js          # Gemini AI (chat, quiz, terms, moderation)
    │   ├── analytics.js       # Firebase Analytics (25+ events)
    │   ├── firestoreService.js # Firestore CRUD + real-time sync
    │   ├── remoteConfig.js    # Firebase Remote Config
    │   └── performanceService.js # Firebase Performance traces
    │
    ├── utils/
    │   ├── validators.js  # Input validation & sanitization
    │   └── formatters.js  # Display formatting utilities
    │
    ├── data/
    │   ├── electionStages.js  # 9 election stages
    │   ├── quizQuestions.js   # 25+ quiz questions
    │   ├── glossaryTerms.js   # 18+ election terms
    │   └── voterChecklist.js  # Voter readiness items
    │
    ├── components/
    │   ├── ErrorBoundary.jsx  # Error boundary with analytics
    │   └── layout/
    │       ├── Sidebar.jsx    # Navigation sidebar
    │       └── layout.css     # Layout styles
    │
    ├── pages/
    │   ├── Home.jsx           # Landing page
    │   ├── ChatPage.jsx       # AI Assistant (Performance traced)
    │   ├── TimelinePage.jsx   # Election timeline
    │   ├── QuizPage.jsx       # Knowledge quizzes (AI explanations)
    │   ├── EncyclopediaPage.jsx # Glossary (AI enrichment)
    │   ├── VoterChecklistPage.jsx # Voter guide
    │   ├── DashboardPage.jsx  # Progress dashboard
    │   ├── NotFound.jsx       # 404 page
    │   └── pages.css          # All page styles
    │
    └── test/
        ├── setup.js                  # Test setup & mocks
        ├── constants.test.js         # Constants integrity
        ├── validators.test.js        # Input validation
        ├── formatters.test.js        # Display formatting
        ├── analytics.test.js         # Analytics events
        ├── gemini.test.js            # Gemini AI service
        ├── firestoreService.test.js  # Firestore operations
        ├── remoteConfig.test.js      # Remote Config
        ├── performanceService.test.js # Performance traces
        ├── auth.test.js              # Authentication flow
        ├── security.test.js          # Security & accessibility
        ├── useFirestore.test.js      # Data hook
        ├── electionStages.test.js    # Stage data integrity
        ├── quizQuestions.test.js     # Quiz data integrity
        ├── glossaryTerms.test.js     # Glossary data integrity
        └── voterChecklist.test.js    # Checklist data integrity
```

---

## 📝 Assumptions

1. **Indian Election Focus** — Content is based on the Election Commission of India's processes and guidelines
2. **Educational Purpose** — The AI is designed for education, not for providing real-time election news
3. **Browser Storage** — User progress is stored locally for zero-cost operation; cloud sync available when Firestore is enabled
4. **API Availability** — The AI chatbot gracefully degrades to pre-built responses when the Gemini API is unavailable

---

## 🔗 Links

- **Live Demo**: https://nirvach-ai.vercel.app/
- **ECI Official**: [eci.gov.in](https://eci.gov.in)
- **Voter Portal**: [voters.eci.gov.in](https://voters.eci.gov.in)
- **SVEEP**: [ecisveep.nic.in](https://ecisveep.nic.in)

---

<p align="center">
  Built with ❤️ for democratic education<br/>
  <strong>NirvachAI</strong> — Understand Democracy, One Step at a Time
</p>
