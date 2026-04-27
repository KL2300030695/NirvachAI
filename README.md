# 🗳️ NirvachAI — Election Process Education Assistant

An interactive, AI-powered assistant that educates citizens about the Indian election process through dynamic conversations, visual timelines, quizzes, and personalized learning paths — all powered by Google Services.

![NirvachAI](https://img.shields.io/badge/NirvachAI-Election_Education-FF6B35?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Auth_|_Analytics-FFCA28?style=flat-square&logo=firebase)
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
3. **Active Assessment** — Categorized quizzes with explanations ensure knowledge retention
4. **Practical Guidance** — A voter readiness checklist walks users through registration and preparation
5. **Reference Library** — A searchable encyclopedia of election terms provides quick lookups

### Decision-Making Logic
- The AI assistant uses a carefully crafted **system prompt** that restricts responses to election education, ensuring factual accuracy and non-partisan content
- The system provides **intelligent fallback responses** when the AI service is unavailable, guaranteeing the app is always educational
- Progress is tracked locally with **LocalStorage** for instant performance and zero-cost operation
- **Firebase Authentication** provides optional Google Sign-In with automatic fallback to local guest mode

---

## 🚀 How the Solution Works

### Architecture

```
┌─────────────────────────────────────────────┐
│              Frontend (Vite + React)          │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Pages   │ │Components│ │   Services    │  │
│  │  Home    │ │ Sidebar  │ │ gemini.js     │  │
│  │  Chat    │ │ Timeline │ │ analytics.js  │  │
│  │  Quiz    │ │ Quiz     │ │ firebase.js   │  │
│  │  ...     │ │ ...      │ │               │  │
│  └─────────┘ └──────────┘ └──────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    ▼             ▼             ▼
┌────────┐ ┌──────────┐ ┌────────────┐
│Firebase │ │ Gemini   │ │  Firebase  │
│  Auth   │ │  AI API  │ │ Analytics  │
└────────┘ └──────────┘ └────────────┘
```

### Features

| Feature | Description | Google Service |
|---------|-------------|---------------|
| 🤖 AI Assistant | Context-aware election Q&A chatbot | Google Gemini AI |
| 📊 Election Timeline | Interactive 9-stage process visualization | — |
| 🧠 Knowledge Quiz | 25+ categorized questions with explanations | — |
| 📖 Encyclopedia | Searchable glossary of 18+ election terms | — |
| 📋 Voter Checklist | Step-by-step voter readiness guide | — |
| 🏆 Dashboard | Progress tracking with achievements | — |
| 🔐 Authentication | Google Sign-In + Guest mode | Firebase Auth |
| 📈 Analytics | Feature usage and engagement tracking | Firebase Analytics |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vite 6 + React 19 |
| Styling | Vanilla CSS with Custom Properties |
| AI | `@google/genai` (Gemini 2.0 Flash) |
| Auth | Firebase Authentication |
| Analytics | Firebase Analytics |
| Icons | Lucide React |
| Routing | React Router v7 |
| Fonts | Google Fonts (Inter, Outfit) |

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

# 5. Build for production
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
- **Modular architecture** — Clean separation: pages, components, services, hooks, data
- **Design system** — Centralized CSS custom properties for consistent theming
- **Reusable components** — Glass cards, buttons, badges shared across pages
- **Named exports** — Clear, descriptive naming throughout

### 2. Security
- **Environment variables** — All API keys in `.env`, never committed (`.gitignore`)
- **AI safety filters** — Gemini configured with content safety settings
- **System prompt guardrails** — AI restricted to election education topics only
- **Input validation** — User inputs sanitized before API calls
- **Firebase Hosting headers** — CSP, X-Frame-Options, XSS protection configured

### 3. Efficiency
- **Vite** — Sub-second HMR, optimized production builds
- **LocalStorage** — Zero-latency data persistence, no network round-trips
- **Lazy analytics** — Firebase Analytics initialized only when supported
- **Minimal dependencies** — Only 4 production dependencies
- **Fallback responses** — AI works offline with pre-built educational content

### 4. Testing
- **Build verification** — `npm run build` passes with zero errors
- **Browser testing** — All 7 pages tested for rendering and functionality
- **Quiz flow** — Category selection → questions → scoring → results verified
- **Timeline interaction** — Stage expansion, progress tracking verified
- **Error handling** — Graceful fallbacks for API failures and auth issues

### 5. Accessibility (WCAG 2.1 AA)
- **Skip navigation** link for keyboard users
- **Semantic HTML** — `<main>`, `<nav>`, `<article>`, `<section>` elements
- **ARIA labels** on all interactive elements
- **Keyboard navigation** — Full tab support with visible focus indicators
- **Color contrast** — ≥ 4.5:1 ratio throughout
- **Reduced motion** — `prefers-reduced-motion` media query support
- **Screen reader** — `aria-live` regions for dynamic content updates
- **High contrast** — `prefers-contrast: high` support

### 6. Google Services
- **Google Gemini AI** — Powers the intelligent chatbot with election-focused system prompt
- **Firebase Authentication** — Google Sign-In with automatic local guest fallback
- **Firebase Analytics** — Custom events tracking: page views, quiz completion, chat messages, feature usage
- **Firebase Hosting** — Production deployment configuration with CDN and security headers
- **Google Fonts** — Inter and Outfit for premium typography

---

## 📁 Project Structure

```
├── .env.example          # Environment variables template
├── firebase.json         # Firebase Hosting config
├── index.html            # Entry HTML with SEO meta tags
├── vite.config.js        # Vite configuration
│
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Root component + routing
    ├── index.css          # Design system (400+ lines)
    │
    ├── config/
    │   └── firebase.js    # Firebase initialization
    │
    ├── contexts/
    │   └── AuthContext.jsx # Auth with Firebase + local fallback
    │
    ├── hooks/
    │   └── useFirestore.js # Data persistence hook
    │
    ├── services/
    │   ├── gemini.js      # Gemini AI with fallback responses
    │   └── analytics.js   # Firebase Analytics events
    │
    ├── data/
    │   ├── electionStages.js  # 9 election stages
    │   ├── quizQuestions.js   # 25+ quiz questions
    │   ├── glossaryTerms.js   # 18+ election terms
    │   └── voterChecklist.js  # Voter readiness items
    │
    ├── components/
    │   └── layout/
    │       ├── Sidebar.jsx    # Navigation sidebar
    │       └── layout.css     # Layout styles
    │
    └── pages/
        ├── Home.jsx           # Landing page
        ├── ChatPage.jsx       # AI Assistant
        ├── TimelinePage.jsx   # Election timeline
        ├── QuizPage.jsx       # Knowledge quizzes
        ├── EncyclopediaPage.jsx # Glossary
        ├── VoterChecklistPage.jsx # Voter guide
        ├── DashboardPage.jsx  # Progress dashboard
        ├── NotFound.jsx       # 404 page
        └── pages.css          # All page styles
```

---

## 📝 Assumptions

1. **Indian Election Focus** — Content is based on the Election Commission of India's processes and guidelines
2. **Educational Purpose** — The AI is designed for education, not for providing real-time election news
3. **Browser Storage** — User progress is stored locally for zero-cost operation; cloud sync available when Firestore is enabled
4. **API Availability** — The AI chatbot gracefully degrades to pre-built responses when the Gemini API is unavailable

---

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **ECI Official**: [eci.gov.in](https://eci.gov.in)
- **Voter Portal**: [voters.eci.gov.in](https://voters.eci.gov.in)
- **SVEEP**: [ecisveep.nic.in](https://ecisveep.nic.in)

---

<p align="center">
  Built with ❤️ for democratic education<br/>
  <strong>NirvachAI</strong> — Understand Democracy, One Step at a Time
</p>
