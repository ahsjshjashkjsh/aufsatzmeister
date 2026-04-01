# AufsatzMeister MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web app that teaches Swiss/German/Austrian students to write better essays through structured learning modules, active AI feedback with exercises, and daily practice.

**Architecture:** Next.js App Router frontend with Supabase for auth and database, Claude API for essay analysis, Stripe for subscriptions. All routes are server-first; client components only where interactivity is needed.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Supabase (Auth + Postgres), Claude API (claude-sonnet-4-6), Stripe, Tailwind CSS, Shadcn/ui, Vercel (hosting)

---

## File Map

```
src/
  app/
    page.tsx                          # Landing page (public)
    demo/page.tsx                     # Free demo module (public)
    auth/login/page.tsx               # Login
    auth/register/page.tsx            # Register
    dashboard/page.tsx                # Main dashboard (authenticated)
    lernpfad/page.tsx                 # Module overview
    lernpfad/[moduleId]/page.tsx      # Single module viewer
    lernpfad/[moduleId]/quiz/page.tsx # Module quiz
    ki-coach/page.tsx                 # Essay upload + feedback
    daily-practice/page.tsx           # Daily exercises
    vokabular/page.tsx                # Vocabulary trainer
    settings/page.tsx                 # Subscription management
    api/
      analyze-essay/route.ts          # POST: Claude essay analysis
      generate-exercise/route.ts      # POST: Claude mini-exercise
      stripe/checkout/route.ts        # POST: create Stripe session
      stripe/webhook/route.ts         # POST: Stripe webhook handler
      progress/route.ts               # GET/POST: user progress
  components/
    LernModul.tsx                     # Module content renderer
    KIFeedback.tsx                    # Feedback display + exercise flow
    MiniExercise.tsx                  # Interactive exercise component
    StreakDisplay.tsx                  # Streak counter + calendar
    ProgressBar.tsx                   # Module progress bar
    PremiumGate.tsx                   # Paywall wrapper component
    Nav.tsx                           # Navigation bar
  lib/
    supabase-server.ts                # Server-side Supabase client
    supabase-client.ts                # Client-side Supabase client
    claude.ts                         # Claude API helper
    stripe.ts                         # Stripe helper
  types/
    index.ts                          # Shared TypeScript types
  data/
    modules.ts                        # Static module content (Lernpfad)
    vocabulary.ts                     # Vocabulary word bank
```

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`, `tsconfig.json`, `.env.local.example`, `tailwind.config.ts`

- [ ] **Step 1: Bootstrap Next.js project**

```bash
npx create-next-app@latest aufsatzmeister \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd aufsatzmeister
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr \
  @anthropic-ai/sdk \
  stripe @stripe/stripe-js \
  shadcn-ui \
  lucide-react \
  clsx tailwind-merge
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
# Choose: Default style, Zinc color, yes to CSS variables
npx shadcn@latest add button card input label badge progress textarea toast
```

- [ ] **Step 4: Create `.env.local.example`**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Claude
ANTHROPIC_API_KEY=your_anthropic_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_PREMIUM_PRICE_ID=your_price_id

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Copy to `.env.local` and fill in real values.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: bootstrap Next.js project with dependencies"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types**

```typescript
// src/types/index.ts

export type UserProfile = {
  id: string
  email: string
  is_premium: boolean
  stripe_customer_id: string | null
  created_at: string
}

export type ModuleProgress = {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  quiz_score: number | null
  completed_at: string | null
}

export type EssayAnalysis = {
  id: string
  user_id: string
  original_text: string
  feedback: FeedbackItem[]
  created_at: string
}

export type FeedbackItem = {
  type: 'grammar' | 'structure' | 'vocabulary' | 'style'
  original: string
  explanation: string
  rule: string
  exercises: Exercise[]
  better_words: BetterWord[]
}

export type Exercise = {
  id: string
  question: string
  correct_answer: string
  hint: string
}

export type BetterWord = {
  original: string
  alternatives: string[]
}

export type LernModul = {
  id: string
  title: string
  description: string
  isPremium: boolean
  sections: ModulSection[]
  quiz: QuizQuestion[]
}

export type ModulSection = {
  title: string
  content: string
  example: string
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type VocabWord = {
  id: string
  word: string
  definition: string
  example: string
  category: 'verb' | 'adjective' | 'connector' | 'noun'
  moduleId: string
}

export type UserStreak = {
  current: number
  longest: number
  last_practice_date: string | null
}

export type DailyExercise = {
  id: string
  type: 'comma' | 'word_choice' | 'improve_sentence' | 'vocabulary'
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript types"
```

---

## Task 3: Supabase Setup

**Files:**
- Create: `src/lib/supabase-server.ts`, `src/lib/supabase-client.ts`
- Create: `supabase/migrations/001_initial.sql`

- [ ] **Step 1: Create Supabase project**

Go to supabase.com → New project → copy URL and keys to `.env.local`

- [ ] **Step 2: Create migration file**

```sql
-- supabase/migrations/001_initial.sql

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  is_premium boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now()
);

-- Module progress
create table public.module_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  module_id text not null,
  completed boolean default false,
  quiz_score integer,
  completed_at timestamptz,
  unique(user_id, module_id)
);

-- Essay analyses
create table public.essay_analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  original_text text not null,
  feedback jsonb not null,
  created_at timestamptz default now()
);

-- Vocabulary progress (which words the user has learned)
create table public.vocab_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  word_id text not null,
  times_seen integer default 0,
  times_correct integer default 0,
  next_review timestamptz default now(),
  unique(user_id, word_id)
);

-- Daily practice streaks
create table public.practice_streaks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_practice_date date
);

-- Monthly essay analysis count (for free tier limit)
create table public.monthly_analysis_count (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  month text not null, -- format: "2026-04"
  count integer default 0,
  unique(user_id, month)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;
alter table public.essay_analyses enable row level security;
alter table public.vocab_progress enable row level security;
alter table public.practice_streaks enable row level security;
alter table public.monthly_analysis_count enable row level security;

-- RLS policies: users can only access their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can manage own progress" on public.module_progress for all using (auth.uid() = user_id);
create policy "Users can manage own analyses" on public.essay_analyses for all using (auth.uid() = user_id);
create policy "Users can manage own vocab" on public.vocab_progress for all using (auth.uid() = user_id);
create policy "Users can manage own streak" on public.practice_streaks for all using (auth.uid() = user_id);
create policy "Users can manage own count" on public.monthly_analysis_count for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

- [ ] **Step 3: Run migration in Supabase dashboard**

Supabase Dashboard → SQL Editor → paste migration → Run

- [ ] **Step 4: Create server-side Supabase client**

```typescript
// src/lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 5: Create client-side Supabase client**

```typescript
// src/lib/supabase-client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add Supabase clients and database schema"
```

---

## Task 4: Static Content — Modules & Vocabulary

**Files:**
- Create: `src/data/modules.ts`
- Create: `src/data/vocabulary.ts`
- Create: `src/data/daily-exercises.ts`

- [ ] **Step 1: Write module content**

```typescript
// src/data/modules.ts
import { LernModul } from '@/types'

export const MODULES: LernModul[] = [
  {
    id: 'modul-1-aufsatzarten',
    title: 'Die vier Aufsatzarten',
    description: 'Lerne die Unterschiede zwischen Erörterung, Beschreibung, Bericht und Erzählung.',
    isPremium: false,
    sections: [
      {
        title: 'Die Erörterung',
        content: `Die Erörterung ist eine argumentative Textform. Du nimmst Stellung zu einer Frage oder These und überzeugst den Leser mit Argumenten.

**Aufbau:**
1. Einleitung: These oder Frage vorstellen
2. Hauptteil: Pro- und Contra-Argumente mit Beispielen
3. Schluss: Eigene Meinung klar formulieren

**Merkmale:** sachlicher Stil, Konjunktiv für fremde Meinungen, Übergangswörter wie "einerseits", "andererseits", "jedoch"`,
        example: `**Beispiel-Einleitung einer Erörterung:**
"Sollten Smartphones im Unterricht verboten sein? Diese Frage beschäftigt viele Schulen. Im Folgenden werde ich die wichtigsten Argumente beider Seiten darlegen und zu einem abschliessenden Urteil kommen."`,
      },
      {
        title: 'Die Beschreibung',
        content: `Die Beschreibung schildert einen Gegenstand, eine Person oder einen Vorgang so genau, dass sich der Leser ein genaues Bild machen kann.

**Aufbau:**
1. Einleitung: Was wird beschrieben?
2. Hauptteil: Systematisch von oben nach unten, aussen nach innen, oder nach Wichtigkeit
3. Schluss: Gesamteindruck

**Merkmale:** Präsens, genaue Adjektive, keine eigene Meinung, objektiv`,
        example: `**Beispiel-Einstieg einer Personenbeschreibung:**
"Die ältere Dame ist etwa 1,65 Meter gross und von schlanker Statur. Ihr graues Haar trägt sie zu einem ordentlichen Dutt gebunden. Auffallend sind ihre lebhaften blauen Augen, die freundlich blicken."`,
      },
      {
        title: 'Der Bericht',
        content: `Der Bericht informiert sachlich über ein Ereignis. Er beantwortet die W-Fragen: Wer? Was? Wann? Wo? Wie? Warum?

**Aufbau:**
1. Einleitung: Die wichtigsten Informationen zuerst
2. Hauptteil: Details in zeitlicher Reihenfolge
3. Schluss: Ergebnis oder Ausblick

**Merkmale:** Präteritum, keine Gefühle, sachlich, kein "ich"`,
        example: `**Beispiel-Einleitung eines Unfallberichts:**
"Am Dienstag, dem 15. März, ereignete sich gegen 14.30 Uhr an der Kreuzung Bahnhofstrasse/Hauptgasse ein Verkehrsunfall. Zwei Fahrzeuge stiessen zusammen, eine Person wurde leicht verletzt."`,
      },
      {
        title: 'Die Erzählung',
        content: `Die Erzählung ist eine kreative Textform. Du erzählst eine Geschichte mit Spannung, Charakteren und einer Handlung.

**Aufbau:**
1. Einleitung: Situation und Personen vorstellen
2. Hauptteil: Handlung aufbauen, Höhepunkt erreichen
3. Schluss: Auflösung und Ergebnis

**Merkmale:** Präteritum, lebendige Sprache, wörtliche Rede, Spannung aufbauen`,
        example: `**Beispiel-Einstieg einer Erzählung:**
"Der Alarm klingelte um halb sieben, doch Jonas hatte die ganze Nacht kein Auge zugemacht. Heute war der Tag — der wichtigste Tag seines Lebens. Er streckte die Hand aus, um das Klingeln zu stoppen, und starrte dann an die Decke."`,
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Welche Aufsatzart eignet sich am besten, um eine Meinung zu begründen?',
        options: ['Die Beschreibung', 'Der Bericht', 'Die Erörterung', 'Die Erzählung'],
        correct: 2,
        explanation: 'Die Erörterung ist die argumentative Textform — du nimmst Stellung zu einer These und überzeugst mit Argumenten.',
      },
      {
        id: 'q2',
        question: 'In welcher Zeitform schreibst du einen Bericht?',
        options: ['Präsens', 'Präteritum', 'Futur', 'Perfekt'],
        correct: 1,
        explanation: 'Der Bericht wird im Präteritum geschrieben (Vergangenheitsform), da er über vergangene Ereignisse berichtet.',
      },
      {
        id: 'q3',
        question: 'Was kennzeichnet eine Beschreibung?',
        options: [
          'Eigene Meinung und Argumente',
          'Objektive, genaue Schilderung ohne eigene Meinung',
          'Spannende Handlung mit Charakteren',
          'W-Fragen in der Einleitung',
        ],
        correct: 1,
        explanation: 'Die Beschreibung ist objektiv — du schilderst genau, ohne deine eigene Meinung einzubringen.',
      },
    ],
  },
  {
    id: 'modul-2-aufbau',
    title: 'Einleitung, Hauptteil, Schluss',
    description: 'Meistere den dreiteiligen Aufbau jedes Aufsatzes.',
    isPremium: true,
    sections: [
      {
        title: 'Die perfekte Einleitung',
        content: `Die Einleitung macht den ersten Eindruck. Sie soll den Leser neugierig machen und das Thema vorstellen.

**3 bewährte Einstiegsmethoden:**
1. **Zitat-Einstieg:** Mit einem passenden Zitat beginnen
2. **Frage-Einstieg:** Eine provokante Frage stellen
3. **Kontrast-Einstieg:** Mit einem Gegensatz überraschen

**Was die Einleitung enthalten muss:**
- Thema vorstellen
- Leser auf den Hauptteil vorbereiten
- Klar und präzise (3-5 Sätze)`,
        example: `**Frage-Einstieg:**
"Wann haben Sie zuletzt ein Buch gelesen — ein richtiges Buch, ohne Bildschirm? Diese Frage stellt sich in einer Zeit, in der Smartphones uns rund um die Uhr beschäftigen, immer drängender. Der folgende Aufsatz untersucht, ob das Lesen als Kulturtechnik gefährdet ist."`,
      },
      {
        title: 'Der Hauptteil',
        content: `Der Hauptteil ist das Herzstück deines Aufsatzes. Hier entwickelst du deine Gedanken systematisch.

**Wichtige Regeln:**
- Ein Gedanke pro Absatz
- Absätze mit Übergangswörtern verbinden
- Beispiele und Belege für jedes Argument

**Übergangswörter die deinen Text verbessern:**
- Ergänzung: "darüber hinaus", "ausserdem", "hinzu kommt"
- Gegensatz: "jedoch", "dennoch", "im Gegensatz dazu"
- Folge: "daher", "folglich", "deshalb"
- Beispiel: "beispielsweise", "so zeigt sich", "konkret bedeutet das"`,
        example: `**Guter Absatz-Übergang:**
"...und so fördert regelmässiges Lesen nachweislich die Konzentrationsfähigkeit. Darüber hinaus erweitert es den Wortschatz erheblich. Studien zeigen, dass Vielleser im Durchschnitt über 50% mehr Vokabular verfügen als Wenigeleser."`,
      },
      {
        title: 'Der Schluss',
        content: `Der Schluss fasst zusammen und hinterlässt einen bleibenden Eindruck.

**Was ein guter Schluss macht:**
- Hauptaussagen kurz zusammenfassen
- Eigene Meinung klar formulieren (bei Erörterungen)
- Ausblick oder Appell (optional)

**Häufige Fehler:**
- Neue Argumente im Schluss einführen ❌
- "Zusammenfassend kann man sagen" — zu langweilig ❌
- Den Schluss zu lang machen ❌`,
        example: `**Starker Schlusssatz einer Erörterung:**
"Angesichts der dargelegten Argumente lässt sich festhalten: Smartphones gehören aus dem Unterricht verbannt — nicht als Bestrafung, sondern als Schutz der Konzentration, die echtes Lernen erst ermöglicht."`,
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Was ist ein häufiger Fehler im Schluss eines Aufsatzes?',
        options: [
          'Die Hauptaussagen zusammenfassen',
          'Neue Argumente einführen',
          'Die eigene Meinung formulieren',
          'Einen Ausblick geben',
        ],
        correct: 1,
        explanation: 'Im Schluss dürfen keine neuen Argumente eingeführt werden — das gehört in den Hauptteil.',
      },
      {
        id: 'q2',
        question: 'Welches Übergangswort drückt einen Gegensatz aus?',
        options: ['darüber hinaus', 'folglich', 'dennoch', 'beispielsweise'],
        correct: 2,
        explanation: '"Dennoch" drückt einen Gegensatz aus. "Darüber hinaus" ergänzt, "folglich" zeigt eine Folge, "beispielsweise" leitet ein Beispiel ein.',
      },
    ],
  },
  {
    id: 'modul-3-grammatik',
    title: 'Grammatik für bessere Aufsätze',
    description: 'Kommaregeln, Zeitformen, Satzstellung — die häufigsten Fehler vermeiden.',
    isPremium: true,
    sections: [
      {
        title: 'Kommaregeln',
        content: `Das Komma ist der häufigste Fehler in deutschen Aufsätzen. Diese Regeln musst du kennen:

**Regel 1: Nebensätze**
Vor Nebensätzen steht immer ein Komma.
Erkennbar an: weil, dass, wenn, obwohl, da, als, während, obwohl

**Regel 2: Aufzählungen**
Zwischen Aufzählungen steht ein Komma (ausser vor "und" und "oder").

**Regel 3: Infinitivgruppen**
Vor "um zu", "ohne zu", "anstatt zu" steht ein Komma.`,
        example: `**Korrekte Beispiele:**
✅ "Ich lerne täglich, weil ich bessere Noten haben möchte."
✅ "Sie liest Bücher, Zeitungen und Artikel."
✅ "Er lernte früh, um die Prüfung zu bestehen."

**Häufige Fehler:**
❌ "Ich lerne täglich weil ich bessere Noten haben möchte."
❌ "Er lernte früh um die Prüfung zu bestehen."`,
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Wo fehlt das Komma? "Ich schreibe den Aufsatz obwohl ich müde bin."',
        options: [
          'Nach "Aufsatz"',
          'Nach "obwohl"',
          'Nach "ich"',
          'Kein Komma nötig',
        ],
        correct: 0,
        explanation: 'Vor "obwohl" steht immer ein Komma, da es einen Nebensatz einleitet. Richtig: "Ich schreibe den Aufsatz, obwohl ich müde bin."',
      },
    ],
  },
  {
    id: 'modul-4-stil',
    title: 'Stil & Ausdruck',
    description: 'Schreibe abwechslungsreich und überzeugend.',
    isPremium: true,
    sections: [
      {
        title: 'Satzvariationen',
        content: `Monotone Sätze machen einen Aufsatz langweilig. Variiere deine Satzstruktur:

**Kurze Sätze:** Erzeugen Spannung. Betonen Wichtiges. Sind einprägsam.

**Lange Sätze:** Ermöglichen es, komplexe Zusammenhänge darzustellen und dem Leser ein vollständiges Bild zu vermitteln.

**Sätze mit Inversion:** Statt "Das Buch liegt auf dem Tisch" → "Auf dem Tisch liegt das Buch."

**Faustregel:** Wechsle zwischen kurzen und langen Sätzen ab.`,
        example: `**Monoton (vermeiden):**
"Das Smartphone ist nützlich. Es hat viele Funktionen. Es kann telefonieren. Es kann fotografieren."

**Abwechslungsreich:**
"Das Smartphone ist ein vielseitiges Gerät: Es ermöglicht Kommunikation, Navigation und Fotografie — und passt dabei in jede Hosentasche."`,
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Was ist Inversion?',
        options: [
          'Ein Satz ohne Verb',
          'Die Umstellung der normalen Satzstellung',
          'Ein sehr langer Satz',
          'Ein Satz mit Komma',
        ],
        correct: 1,
        explanation: 'Inversion bedeutet, dass das Subjekt und Verb die Stellung tauschen, oft wenn ein anderes Element an den Satzanfang gestellt wird.',
      },
    ],
  },
  {
    id: 'modul-5-wortschatz',
    title: 'Wortschatz & starke Sprache',
    description: 'Ersetze schwache Wörter durch starke Ausdrücke.',
    isPremium: true,
    sections: [
      {
        title: 'Schwache Wörter ersetzen',
        content: `Diese Wörter schwächen deinen Aufsatz — ersetze sie:

| Schwach | Stark |
|---------|-------|
| gut | hervorragend, treffend, überzeugend |
| schlecht | mangelhaft, unzulänglich, problematisch |
| sagen | erläutern, betonen, verdeutlichen |
| machen | bewirken, veranlassen, ermöglichen |
| zeigen | belegen, verdeutlichen, demonstrieren |
| denken | vermuten, davon ausgehen, annehmen |
| wichtig | entscheidend, wesentlich, massgeblich |`,
        example: `**Schwacher Satz:**
"Diese Lösung ist gut und zeigt, dass das Problem gelöst werden kann."

**Starker Satz:**
"Diese Lösung ist überzeugend und belegt, dass das Problem erfolgreich bewältigt werden kann."`,
      },
    ],
    quiz: [
      {
        id: 'q1',
        question: 'Welches Wort ist ein starker Ersatz für "zeigen"?',
        options: ['sagen', 'machen', 'belegen', 'denken'],
        correct: 2,
        explanation: '"Belegen" ist präziser und stärker als "zeigen" — es impliziert Beweis und Überzeugungskraft.',
      },
    ],
  },
]

export function getModule(id: string): LernModul | undefined {
  return MODULES.find(m => m.id === id)
}

export function getFreeModules(): LernModul[] {
  return MODULES.filter(m => !m.isPremium)
}
```

- [ ] **Step 2: Write vocabulary bank**

```typescript
// src/data/vocabulary.ts
import { VocabWord } from '@/types'

export const VOCABULARY: VocabWord[] = [
  { id: 'v1', word: 'erläutern', definition: 'etwas ausführlich erklären', example: 'Der Autor erläutert seine These mit drei Beispielen.', category: 'verb', moduleId: 'modul-5-wortschatz' },
  { id: 'v2', word: 'verdeutlichen', definition: 'klar und verständlich machen', example: 'Das Diagramm verdeutlicht den Zusammenhang.', category: 'verb', moduleId: 'modul-5-wortschatz' },
  { id: 'v3', word: 'überzeugend', definition: 'so gut, dass man es glauben muss', example: 'Seine Argumente sind überzeugend.', category: 'adjective', moduleId: 'modul-5-wortschatz' },
  { id: 'v4', word: 'entscheidend', definition: 'von grosser Wichtigkeit', example: 'Dies ist der entscheidende Punkt.', category: 'adjective', moduleId: 'modul-5-wortschatz' },
  { id: 'v5', word: 'darüber hinaus', definition: 'zusätzlich, ausserdem', example: 'Darüber hinaus bietet die App tägliche Übungen.', category: 'connector', moduleId: 'modul-2-aufbau' },
  { id: 'v6', word: 'folglich', definition: 'als Folge davon', example: 'Er lernte täglich, folglich verbesserten sich seine Noten.', category: 'connector', moduleId: 'modul-2-aufbau' },
  { id: 'v7', word: 'dennoch', definition: 'trotzdem, aber trotz allem', example: 'Es regnete stark, dennoch gingen wir spazieren.', category: 'connector', moduleId: 'modul-2-aufbau' },
  { id: 'v8', word: 'belegen', definition: 'mit Beweisen zeigen', example: 'Studien belegen die Wirksamkeit dieser Methode.', category: 'verb', moduleId: 'modul-5-wortschatz' },
  { id: 'v9', word: 'massgeblich', definition: 'sehr wichtig und bestimmend', example: 'Diese Entscheidung war massgeblich für den Erfolg.', category: 'adjective', moduleId: 'modul-5-wortschatz' },
  { id: 'v10', word: 'infolgedessen', definition: 'als Ergebnis davon', example: 'Der Plan scheiterte, infolgedessen musste eine neue Lösung gefunden werden.', category: 'connector', moduleId: 'modul-2-aufbau' },
]

export function getDailyVocab(userId: string, count = 5): VocabWord[] {
  // Simple rotation based on date
  const today = new Date().toDateString()
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const start = seed % VOCABULARY.length
  const result: VocabWord[] = []
  for (let i = 0; i < count; i++) {
    result.push(VOCABULARY[(start + i) % VOCABULARY.length])
  }
  return result
}
```

- [ ] **Step 3: Write daily exercises**

```typescript
// src/data/daily-exercises.ts
import { DailyExercise } from '@/types'

export const DAILY_EXERCISES: DailyExercise[] = [
  {
    id: 'e1',
    type: 'comma',
    question: 'Setze das Komma: "Ich lerne täglich weil ich die Prüfung bestehen möchte."',
    correct_answer: 'Ich lerne täglich, weil ich die Prüfung bestehen möchte.',
    explanation: 'Vor "weil" steht immer ein Komma, da es einen Nebensatz einleitet.',
  },
  {
    id: 'e2',
    type: 'word_choice',
    question: 'Welches Wort passt besser in einen formellen Aufsatz?',
    options: ['gut', 'hervorragend', 'super', 'toll'],
    correct_answer: 'hervorragend',
    explanation: '"Hervorragend" ist präzise und formal. "Super" und "toll" sind umgangssprachlich.',
  },
  {
    id: 'e3',
    type: 'improve_sentence',
    question: 'Verbessere diesen Satz: "Das ist gut und zeigt dass es klappt."',
    correct_answer: 'Dies ist überzeugend und belegt, dass die Methode wirksam ist.',
    explanation: 'Starke Verben (belegen statt zeigen) und präzise Adjektive (überzeugend statt gut) verbessern den Ausdruck.',
  },
  {
    id: 'e4',
    type: 'comma',
    question: 'Wo fehlt das Komma? "Er las das Buch obwohl er müde war."',
    options: [
      'Er las das Buch, obwohl er müde war.',
      'Er las, das Buch obwohl er müde war.',
      'Er las das Buch obwohl, er müde war.',
      'Kein Komma nötig',
    ],
    correct_answer: 'Er las das Buch, obwohl er müde war.',
    explanation: 'Vor "obwohl" steht immer ein Komma — es leitet einen Nebensatz ein.',
  },
  {
    id: 'e5',
    type: 'word_choice',
    question: 'Ersetze "sagen" durch ein stärkeres Verb: "Der Autor ___ seine Meinung."',
    options: ['sagt', 'erläutert', 'macht', 'findet'],
    correct_answer: 'erläutert',
    explanation: '"Erläutern" ist präziser als "sagen" — es bedeutet ausführlich und klar erklären.',
  },
]

export function getTodaysExercises(): DailyExercise[] {
  const today = new Date().toDateString()
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const shuffled = [...DAILY_EXERCISES].sort((a, b) => {
    const hashA = (seed * a.id.charCodeAt(0)) % 100
    const hashB = (seed * b.id.charCodeAt(0)) % 100
    return hashA - hashB
  })
  return shuffled.slice(0, 3)
}
```

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add static module content, vocabulary, and daily exercises"
```

---

## Task 5: Navigation & Layout

**Files:**
- Create: `src/components/Nav.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Nav component**

```tsx
// src/components/Nav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Brain, Dumbbell, BookMarked, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lernpfad', label: 'Lernpfad', icon: BookOpen },
  { href: '/ki-coach', label: 'KI-Coach', icon: Brain },
  { href: '/daily-practice', label: 'Tagesübung', icon: Dumbbell },
  { href: '/vokabular', label: 'Wortschatz', icon: BookMarked },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:static md:border-t-0 md:border-r md:h-full md:w-56 md:flex md:flex-col">
      <div className="hidden md:block px-4 py-6">
        <h1 className="text-xl font-bold text-zinc-900">AufsatzMeister</h1>
        <p className="text-xs text-zinc-500 mt-1">Deutsch besser schreiben</p>
      </div>
      <ul className="flex md:flex-col justify-around md:justify-start md:gap-1 md:px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'flex flex-col md:flex-row items-center md:gap-3 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

- [ ] **Step 2: Update root layout**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AufsatzMeister — Deutsch besser schreiben',
  description: 'Lerne Aufsätze schreiben mit KI-Feedback und täglichen Übungen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.tsx src/app/layout.tsx
git commit -m "feat: add navigation component and root layout"
```

---

## Task 6: Auth Pages

**Files:**
- Create: `src/app/auth/login/page.tsx`
- Create: `src/app/auth/register/page.tsx`
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create login page**

```tsx
// src/app/auth/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-Mail oder Passwort falsch.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Anmelden</CardTitle>
          <CardDescription>Melde dich bei AufsatzMeister an</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-zinc-600">
            Noch kein Konto?{' '}
            <Link href="/auth/register" className="text-zinc-900 font-medium hover:underline">
              Registrieren
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create register page**

```tsx
// src/app/auth/register/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('Registrierung fehlgeschlagen. Versuche es erneut.')
      setLoading(false)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <Card className="w-full max-w-md text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Bestätige deine E-Mail</h2>
          <p className="text-zinc-600">Wir haben dir einen Bestätigungslink an <strong>{email}</strong> gesendet.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Konto erstellen</CardTitle>
          <CardDescription>Starte kostenlos mit AufsatzMeister</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Passwort (min. 8 Zeichen)</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registrieren...' : 'Kostenlos starten'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-zinc-600">
            Bereits registriert?{' '}
            <Link href="/auth/login" className="text-zinc-900 font-medium hover:underline">
              Anmelden
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Create auth callback route**

```typescript
// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(`${origin}/dashboard`)
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/auth/
git commit -m "feat: add login and register pages"
```

---

## Task 7: Landing Page

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create landing page**

```tsx
// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Brain, BookOpen, Dumbbell, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">AufsatzMeister</h1>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="ghost">Anmelden</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Kostenlos starten</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
          Bessere Noten in Deutsch.<br />
          <span className="text-zinc-500">In 30 Tagen.</span>
        </h2>
        <p className="text-lg text-zinc-600 mb-8">
          AufsatzMeister lehrt dich Aufsätze schreiben durch strukturierte Module,
          echtes KI-Feedback und tägliche Übungen. Kein ChatGPT, das für dich schreibt —
          du lernst es selbst.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/register">
            <Button size="lg">Jetzt kostenlos starten</Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">Demo ansehen</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-zinc-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <BookOpen className="h-10 w-10 mx-auto mb-4 text-zinc-700" />
            <h3 className="font-semibold mb-2">Strukturierter Lernpfad</h3>
            <p className="text-zinc-600 text-sm">5 Module von Aufsatzarten bis Stil — Schritt für Schritt aufgebaut.</p>
          </div>
          <div className="text-center">
            <Brain className="h-10 w-10 mx-auto mb-4 text-zinc-700" />
            <h3 className="font-semibold mb-2">KI-Coach mit echtem Feedback</h3>
            <p className="text-zinc-600 text-sm">Lade deinen Aufsatz hoch. Die KI erklärt Fehler und du übst sie sofort.</p>
          </div>
          <div className="text-center">
            <Dumbbell className="h-10 w-10 mx-auto mb-4 text-zinc-700" />
            <h3 className="font-semibold mb-2">5 Min täglich reichen</h3>
            <p className="text-zinc-600 text-sm">Daily Practice hält deinen Fortschritt aufrecht — wie Duolingo für Aufsätze.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Einfache Preise</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-1">Gratis</h3>
            <p className="text-3xl font-bold mb-4">0 CHF</p>
            <ul className="space-y-2 text-sm text-zinc-600">
              {['Modul 1 komplett', '1 KI-Feedback pro Monat', 'Tägliche Übungen'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
              ))}
            </ul>
            <Link href="/auth/register" className="block mt-6">
              <Button className="w-full" variant="outline">Kostenlos starten</Button>
            </Link>
          </div>
          <div className="border-2 border-zinc-900 rounded-xl p-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-3 py-1 rounded-full">Empfohlen</span>
            <h3 className="font-bold text-lg mb-1">Premium</h3>
            <p className="text-3xl font-bold mb-4">9 CHF <span className="text-base font-normal text-zinc-500">/ Monat</span></p>
            <ul className="space-y-2 text-sm text-zinc-600">
              {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)', 'Wortschatz-Trainer'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
              ))}
            </ul>
            <Link href="/auth/register" className="block mt-6">
              <Button className="w-full">Jetzt upgraden</Button>
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-zinc-500 mt-6">
          "Wenn deine Note steigt, zahlt sich das Abo aus dem ersten besseren Zeugnis zurück."
        </p>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add landing page with pricing"
```

---

## Task 8: Dashboard

**Files:**
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard**

```tsx
// src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Dumbbell, Flame, BookOpen } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: streak } = await supabase
    .from('practice_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: progress } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', user.id)

  const completedModules = progress?.filter(p => p.completed).length ?? 0

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Hallo!</h1>
        <p className="text-zinc-500 mb-8">Bereit zum Lernen?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{streak?.current_streak ?? 0}</p>
              <p className="text-sm text-zinc-500">Tage Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{completedModules}/{MODULES.length}</p>
              <p className="text-sm text-zinc-500">Module</p>
            </CardContent>
          </Card>
          {!profile?.is_premium && (
            <Card className="col-span-2 md:col-span-1 bg-zinc-900 text-white">
              <CardContent className="pt-6 text-center">
                <p className="font-semibold mb-1">Upgrade auf Premium</p>
                <p className="text-xs text-zinc-400 mb-3">Alle Module + KI-Feedback</p>
                <Link href="/settings">
                  <Button size="sm" variant="secondary">9 CHF/Monat</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <h2 className="font-semibold mb-3">Nächste Aufgaben</h2>
        <div className="space-y-3">
          <Link href="/daily-practice">
            <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <Dumbbell className="h-6 w-6 text-zinc-600" />
                <div>
                  <p className="font-medium">Tagesübung</p>
                  <p className="text-sm text-zinc-500">5 Minuten täglich</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/lernpfad">
            <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <BookOpen className="h-6 w-6 text-zinc-600" />
                <div>
                  <p className="font-medium">Lernpfad fortsetzen</p>
                  <p className="text-sm text-zinc-500">{MODULES[Math.min(completedModules, MODULES.length - 1)].title}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/ki-coach">
            <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <Brain className="h-6 w-6 text-zinc-600" />
                <div>
                  <p className="font-medium">Aufsatz analysieren</p>
                  <p className="text-sm text-zinc-500">KI-Feedback auf deinen Text</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/
git commit -m "feat: add dashboard with streak and module progress"
```

---

## Task 9: Lernpfad

**Files:**
- Create: `src/components/LernModul.tsx`
- Create: `src/components/PremiumGate.tsx`
- Create: `src/app/lernpfad/page.tsx`
- Create: `src/app/lernpfad/[moduleId]/page.tsx`

- [ ] **Step 1: Create PremiumGate component**

```tsx
// src/components/PremiumGate.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Lock className="h-12 w-12 text-zinc-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Premium-Inhalt</h3>
      <p className="text-zinc-600 mb-6 max-w-sm">
        Dieses Modul ist nur für Premium-Mitglieder verfügbar. Upgrade für 9 CHF/Monat und erhalte Zugang zu allen Modulen.
      </p>
      <Link href="/settings">
        <Button>Jetzt upgraden — 9 CHF/Monat</Button>
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Create module viewer component**

```tsx
// src/components/LernModul.tsx
'use client'
import { useState } from 'react'
import { LernModul as LernModulType } from '@/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

type Props = {
  modul: LernModulType
  onComplete: (quizScore: number) => void
}

export function LernModul({ modul, onComplete }: Props) {
  const [step, setStep] = useState<'content' | 'quiz'>('content')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  const section = modul.sections[sectionIndex]
  const question = modul.quiz[quizIndex]
  const progress = step === 'content'
    ? (sectionIndex / modul.sections.length) * 50
    : 50 + ((quizIndex / modul.quiz.length) * 50)

  function nextSection() {
    if (sectionIndex < modul.sections.length - 1) {
      setSectionIndex(s => s + 1)
    } else {
      setStep('quiz')
    }
  }

  function handleAnswer(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setShowExplanation(true)
    if (idx === question.correct) setCorrect(c => c + 1)
  }

  function nextQuestion() {
    setSelected(null)
    setShowExplanation(false)
    if (quizIndex < modul.quiz.length - 1) {
      setQuizIndex(q => q + 1)
    } else {
      onComplete(Math.round((correct / modul.quiz.length) * 100))
    }
  }

  return (
    <div className="max-w-2xl">
      <Progress value={progress} className="mb-6" />

      {step === 'content' ? (
        <div>
          <p className="text-sm text-zinc-500 mb-1">Abschnitt {sectionIndex + 1} von {modul.sections.length}</p>
          <h2 className="text-xl font-bold mb-4">{section.title}</h2>
          <div className="prose prose-zinc max-w-none mb-4">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
          <div className="bg-zinc-50 rounded-lg p-4 mb-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Beispiel</p>
            <div className="prose prose-zinc max-w-none text-sm">
              <ReactMarkdown>{section.example}</ReactMarkdown>
            </div>
          </div>
          <Button onClick={nextSection}>
            {sectionIndex < modul.sections.length - 1 ? 'Weiter' : 'Zum Quiz'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-zinc-500 mb-1">Frage {quizIndex + 1} von {modul.quiz.length}</p>
          <h2 className="text-lg font-semibold mb-6">{question.question}</h2>
          <div className="space-y-3 mb-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  selected === null ? 'hover:bg-zinc-50 border-zinc-200' :
                  idx === question.correct ? 'bg-green-50 border-green-500 text-green-800' :
                  idx === selected ? 'bg-red-50 border-red-500 text-red-800' :
                  'border-zinc-200 text-zinc-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">{question.explanation}</p>
            </div>
          )}
          {selected !== null && (
            <Button onClick={nextQuestion}>
              {quizIndex < modul.quiz.length - 1 ? 'Nächste Frage' : 'Modul abschliessen'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Install react-markdown**

```bash
npm install react-markdown
```

- [ ] **Step 4: Create module list page**

```tsx
// src/app/lernpfad/page.tsx
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Lock, ChevronRight } from 'lucide-react'

export default async function LernpfadPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
  const { data: progress } = await supabase.from('module_progress').select('*').eq('user_id', user.id)
  const isPremium = profile?.is_premium ?? false

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Lernpfad</h1>
        <p className="text-zinc-500 mb-8">Schritt für Schritt zum besseren Aufsatz.</p>
        <div className="space-y-3">
          {MODULES.map((modul, i) => {
            const isLocked = modul.isPremium && !isPremium
            const done = progress?.find(p => p.module_id === modul.id && p.completed)
            return (
              <Link key={modul.id} href={isLocked ? '/settings' : `/lernpfad/${modul.id}`}>
                <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
                  <CardContent className="pt-4 pb-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${done ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {done ? <CheckCircle className="h-5 w-5" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{modul.title}</p>
                      <p className="text-sm text-zinc-500">{modul.description}</p>
                    </div>
                    {isLocked ? <Lock className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Create single module page**

```tsx
// src/app/lernpfad/[moduleId]/page.tsx
'use client'
import { use, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Nav } from '@/components/Nav'
import { LernModul } from '@/components/LernModul'
import { PremiumGate } from '@/components/PremiumGate'
import { getModule } from '@/data/modules'
import { notFound, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = { params: Promise<{ moduleId: string }> }

export default function ModulePage({ params }: Props) {
  const { moduleId } = use(params)
  const modul = getModule(moduleId)
  if (!modul) notFound()

  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  async function handleComplete(quizScore: number) {
    setScore(quizScore)
    setCompleted(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('module_progress').upsert({
      user_id: user.id,
      module_id: moduleId,
      completed: true,
      quiz_score: quizScore,
      completed_at: new Date().toISOString(),
    })
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6">
        {completed ? (
          <div className="max-w-md mx-auto text-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Modul abgeschlossen!</h2>
            <p className="text-zinc-600 mb-6">Quiz-Ergebnis: {score}%</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/lernpfad')}>Zurück zum Lernpfad</Button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">{modul.title}</h1>
            <LernModul modul={modul} onComplete={handleComplete} />
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/app/lernpfad/
git commit -m "feat: add learning path with module viewer and quiz"
```

---

## Task 10: Claude API Integration

**Files:**
- Create: `src/lib/claude.ts`
- Create: `src/app/api/analyze-essay/route.ts`

- [ ] **Step 1: Create Claude helper**

```typescript
// src/lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'
import { FeedbackItem } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function analyzeEssay(text: string): Promise<FeedbackItem[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Analysiere diesen deutschen Aufsatz eines Schülers und gib konkretes, lehrreiches Feedback.

AUFSATZ:
${text}

Antworte NUR mit einem JSON-Array von FeedbackItem-Objekten in diesem Format:
[
  {
    "type": "grammar|structure|vocabulary|style",
    "original": "der fehlerhafte Satz oder Ausdruck aus dem Text",
    "explanation": "Kurze Erklärung des Problems (1-2 Sätze)",
    "rule": "Die Grammatikregel oder Schreibregel als prägnanter Satz",
    "exercises": [
      {
        "id": "ex1",
        "question": "Übungsaufgabe zum gleichen Thema",
        "correct_answer": "Die korrekte Antwort",
        "hint": "Ein hilfreicher Hinweis"
      }
    ],
    "better_words": [
      {
        "original": "schwaches Wort aus dem Text",
        "alternatives": ["stärkeres Wort 1", "stärkeres Wort 2", "stärkeres Wort 3"]
      }
    ]
  }
]

Gib maximal 4 Feedback-Items zurück. Fokussiere auf die wichtigsten Fehler. Sei lehrreich, nicht nur korrigierend.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('No JSON found in response')

  return JSON.parse(jsonMatch[0]) as FeedbackItem[]
}
```

- [ ] **Step 2: Create essay analysis API route**

```typescript
// src/app/api/analyze-essay/route.ts
import { createClient } from '@/lib/supabase-server'
import { analyzeEssay } from '@/lib/claude'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
  const isPremium = profile?.is_premium ?? false

  if (!isPremium) {
    const currentMonth = new Date().toISOString().slice(0, 7)
    const { data: monthlyCount } = await supabase
      .from('monthly_analysis_count')
      .select('count')
      .eq('user_id', user.id)
      .eq('month', currentMonth)
      .single()

    if (monthlyCount && monthlyCount.count >= 1) {
      return NextResponse.json({ error: 'LIMIT_REACHED' }, { status: 403 })
    }
  }

  const { text } = await request.json()
  if (!text || text.length < 50) {
    return NextResponse.json({ error: 'Text zu kurz (min. 50 Zeichen)' }, { status: 400 })
  }

  try {
    const feedback = await analyzeEssay(text)

    await supabase.from('essay_analyses').insert({
      user_id: user.id,
      original_text: text,
      feedback,
    })

    if (!isPremium) {
      const currentMonth = new Date().toISOString().slice(0, 7)
      await supabase.from('monthly_analysis_count').upsert({
        user_id: user.id,
        month: currentMonth,
        count: 1,
      }, { onConflict: 'user_id,month' })
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/claude.ts src/app/api/analyze-essay/
git commit -m "feat: add Claude essay analysis API"
```

---

## Task 11: KI-Coach UI

**Files:**
- Create: `src/components/KIFeedback.tsx`
- Create: `src/components/MiniExercise.tsx`
- Create: `src/app/ki-coach/page.tsx`

- [ ] **Step 1: Create MiniExercise component**

```tsx
// src/components/MiniExercise.tsx
'use client'
import { useState } from 'react'
import { Exercise } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle } from 'lucide-react'

type Props = {
  exercise: Exercise
  onComplete: (correct: boolean) => void
}

export function MiniExercise({ exercise, onComplete }: Props) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = answer.trim().toLowerCase() === exercise.correct_answer.toLowerCase()

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => onComplete(isCorrect), 1500)
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-3">
      <p className="font-medium text-sm mb-3">{exercise.question}</p>
      <Input
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        disabled={submitted}
        placeholder="Deine Antwort..."
        className="mb-2"
        onKeyDown={e => e.key === 'Enter' && !submitted && handleSubmit()}
      />
      {!submitted && (
        <Button size="sm" onClick={handleSubmit} disabled={!answer.trim()}>Prüfen</Button>
      )}
      {submitted && (
        <div className={`flex items-center gap-2 text-sm mt-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {isCorrect ? 'Richtig!' : `Richtig wäre: "${exercise.correct_answer}"`}
        </div>
      )}
      <p className="text-xs text-zinc-500 mt-2">Hinweis: {exercise.hint}</p>
    </div>
  )
}
```

- [ ] **Step 2: Create KIFeedback component**

```tsx
// src/components/KIFeedback.tsx
'use client'
import { useState } from 'react'
import { FeedbackItem } from '@/types'
import { MiniExercise } from './MiniExercise'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

const typeLabels: Record<string, string> = {
  grammar: 'Grammatik',
  structure: 'Struktur',
  vocabulary: 'Wortschatz',
  style: 'Stil',
}

const typeColors: Record<string, string> = {
  grammar: 'bg-red-100 text-red-800',
  structure: 'bg-blue-100 text-blue-800',
  vocabulary: 'bg-purple-100 text-purple-800',
  style: 'bg-orange-100 text-orange-800',
}

type Props = { feedback: FeedbackItem[] }

export function KIFeedback({ feedback }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0)
  const [exerciseIndex, setExerciseIndex] = useState<Record<number, number>>({})
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  function handleExerciseComplete(feedbackIdx: number, correct: boolean) {
    const current = exerciseIndex[feedbackIdx] ?? 0
    const item = feedback[feedbackIdx]
    if (current < item.exercises.length - 1) {
      setExerciseIndex(prev => ({ ...prev, [feedbackIdx]: current + 1 }))
    } else {
      setCompleted(prev => new Set(prev).add(feedbackIdx))
    }
  }

  return (
    <div className="space-y-3">
      {feedback.map((item, idx) => {
        const isDone = completed.has(idx)
        const currentExercise = exerciseIndex[idx] ?? 0
        return (
          <div key={idx} className={`border rounded-xl overflow-hidden ${isDone ? 'border-green-300 bg-green-50' : 'border-zinc-200'}`}>
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type]}`}>
                  {typeLabels[item.type]}
                </span>
                <span className="text-sm font-medium line-clamp-1">"{item.original}"</span>
              </div>
              {expanded === idx ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
            </button>

            {expanded === idx && (
              <div className="px-4 pb-4 border-t border-zinc-100">
                <div className="py-3">
                  <p className="text-sm text-zinc-700 mb-2">{item.explanation}</p>
                  <div className="bg-zinc-100 rounded px-3 py-2 text-xs font-medium text-zinc-600">
                    Regel: {item.rule}
                  </div>
                </div>

                {item.better_words.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">Stärkere Alternativen:</p>
                    {item.better_words.map((bw, bwIdx) => (
                      <div key={bwIdx} className="flex flex-wrap gap-2">
                        <span className="text-sm line-through text-zinc-400">{bw.original}</span>
                        <span className="text-zinc-400">→</span>
                        {bw.alternatives.map(alt => (
                          <Badge key={alt} variant="secondary">{alt}</Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {!isDone && item.exercises.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 mb-1">
                      Übung {currentExercise + 1} von {item.exercises.length}:
                    </p>
                    <MiniExercise
                      exercise={item.exercises[currentExercise]}
                      onComplete={(correct) => handleExerciseComplete(idx, correct)}
                    />
                  </div>
                )}
                {isDone && (
                  <p className="text-sm text-green-600 font-medium mt-2">Alle Übungen abgeschlossen!</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 3: Create KI-Coach page**

```tsx
// src/app/ki-coach/page.tsx
'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { KIFeedback } from '@/components/KIFeedback'
import { FeedbackItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function KICoachPage() {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function analyzeEssay() {
    if (text.length < 50) {
      setError('Bitte schreibe mindestens 50 Zeichen.')
      return
    }
    setLoading(true)
    setError('')
    setFeedback(null)

    const res = await fetch('/api/analyze-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data = await res.json()

    if (res.status === 403 && data.error === 'LIMIT_REACHED') {
      setError('Du hast dein monatliches Feedback-Limit erreicht. Upgrade auf Premium für unbegrenzte Analysen.')
      setLoading(false)
      return
    }
    if (!res.ok) {
      setError(data.error || 'Analyse fehlgeschlagen.')
      setLoading(false)
      return
    }

    setFeedback(data.feedback)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-6 w-6" />
          <h1 className="text-2xl font-bold">KI-Coach</h1>
        </div>
        <p className="text-zinc-500 mb-8">Füge deinen Aufsatz ein und erhalte lehrreiches Feedback mit Übungen.</p>

        {!feedback ? (
          <div>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Füge hier deinen Aufsatz ein (mindestens 50 Zeichen)..."
              className="min-h-48 mb-4"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">{text.length} Zeichen</span>
              <Button onClick={analyzeEssay} disabled={loading || text.length < 50}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysiere...</>
                ) : (
                  <><Brain className="mr-2 h-4 w-4" /> Aufsatz analysieren</>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
                {error.includes('Limit') && (
                  <Link href="/settings" className="text-red-700 underline text-sm font-medium">
                    Jetzt upgraden →
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Dein Feedback ({feedback.length} Punkte)</h2>
              <Button variant="outline" size="sm" onClick={() => setFeedback(null)}>
                Neuer Aufsatz
              </Button>
            </div>
            <KIFeedback feedback={feedback} />
          </div>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/KIFeedback.tsx src/components/MiniExercise.tsx src/app/ki-coach/
git commit -m "feat: add KI-Coach with active feedback and mini exercises"
```

---

## Task 12: Daily Practice

**Files:**
- Create: `src/app/daily-practice/page.tsx`

- [ ] **Step 1: Create daily practice page**

```tsx
// src/app/daily-practice/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { getTodaysExercises } from '@/data/daily-exercises'
import { DailyExercise } from '@/types'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Flame } from 'lucide-react'

export default function DailyPracticePage() {
  const [exercises] = useState<DailyExercise[]>(getTodaysExercises())
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const exercise = exercises[index]
  const progress = (index / exercises.length) * 100
  const isCorrect = selected?.trim().toLowerCase() === exercise?.correct_answer.toLowerCase()

  function handleSubmit() {
    setSubmitted(true)
    if (isCorrect) setCorrect(c => c + 1)
  }

  async function handleNext() {
    if (index < exercises.length - 1) {
      setIndex(i => i + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      setDone(true)
      await updateStreak()
    }
  }

  async function updateStreak() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().slice(0, 10)
    const { data: streak } = await supabase
      .from('practice_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const newStreak = streak?.last_practice_date === yesterday ? (streak.current_streak + 1) : 1
    const longest = Math.max(newStreak, streak?.longest_streak ?? 0)

    await supabase.from('practice_streaks').upsert({
      user_id: user.id,
      current_streak: newStreak,
      longest_streak: longest,
      last_practice_date: today,
    })
  }

  if (done) {
    return (
      <div className="flex min-h-screen">
        <Nav />
        <main className="flex-1 p-6 pb-20 md:pb-6 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <Flame className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tagesübung abgeschlossen!</h2>
            <p className="text-zinc-600 mb-2">{correct}/{exercises.length} Aufgaben richtig</p>
            <p className="text-zinc-500 text-sm mb-6">Dein Streak wurde aktualisiert. Komm morgen wieder!</p>
            <Button onClick={() => window.location.href = '/dashboard'}>Zurück zum Dashboard</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Tagesübung</h1>
        <p className="text-zinc-500 mb-6">Aufgabe {index + 1} von {exercises.length}</p>
        <Progress value={progress} className="mb-8" />

        <h2 className="text-lg font-semibold mb-6">{exercise.question}</h2>

        {exercise.options ? (
          <div className="space-y-3 mb-6">
            {exercise.options.map(opt => (
              <button
                key={opt}
                onClick={() => !submitted && setSelected(opt)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  submitted
                    ? opt === exercise.correct_answer ? 'bg-green-50 border-green-500'
                    : opt === selected ? 'bg-red-50 border-red-400'
                    : 'border-zinc-200 text-zinc-400'
                    : selected === opt ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={selected ?? ''}
            onChange={e => !submitted && setSelected(e.target.value)}
            className="w-full border rounded-lg p-3 min-h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="Deine Antwort..."
          />
        )}

        {submitted && (
          <div className={`flex items-start gap-2 p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isCorrect ? <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
            <div>
              <p className="font-medium">{isCorrect ? 'Richtig!' : 'Nicht ganz.'}</p>
              <p className="text-sm mt-1">{exercise.explanation}</p>
              {!isCorrect && <p className="text-sm mt-1">Richtig: <strong>{exercise.correct_answer}</strong></p>}
            </div>
          </div>
        )}

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!selected} className="w-full">Antwort prüfen</Button>
        ) : (
          <Button onClick={handleNext} className="w-full">
            {index < exercises.length - 1 ? 'Weiter' : 'Abschliessen'}
          </Button>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/daily-practice/
git commit -m "feat: add daily practice with streak tracking"
```

---

## Task 13: Stripe Subscription

**Files:**
- Create: `src/lib/stripe.ts`
- Create: `src/app/api/stripe/checkout/route.ts`
- Create: `src/app/api/stripe/webhook/route.ts`
- Create: `src/app/settings/page.tsx`

- [ ] **Step 1: Create Stripe helper**

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})
```

- [ ] **Step 2: Create checkout route**

```typescript
// src/app/api/stripe/checkout/route.ts
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    customer_email: user.email,
    metadata: { user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
```

- [ ] **Step 3: Create Stripe webhook**

```typescript
// src/app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const userId = session.metadata?.user_id
    if (userId) {
      await supabase.from('profiles').update({
        is_premium: true,
        stripe_customer_id: session.customer as string,
      }).eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    await supabase.from('profiles').update({ is_premium: false }).eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
```

- [ ] **Step 4: Create settings page**

```tsx
// src/app/settings/page.tsx
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

async function createCheckoutSession() {
  'use server'
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout`, {
    method: 'POST',
    credentials: 'include',
  })
  const { url } = await res.json()
  redirect(url)
}

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isPremium = profile?.is_premium ?? false

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-8">Einstellungen</h1>

        <Card className="mb-6">
          <CardHeader><CardTitle>Dein Abo</CardTitle></CardHeader>
          <CardContent>
            {isPremium ? (
              <div>
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Premium aktiv
                </div>
                <p className="text-sm text-zinc-600">Du hast Zugang zu allen Modulen und unbegrenzt KI-Feedback.</p>
              </div>
            ) : (
              <div>
                <p className="text-zinc-600 mb-4">Du nutzt die Gratisversion. Upgrade für alle Features.</p>
                <ul className="space-y-2 text-sm text-zinc-600 mb-6">
                  {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)'].map(f => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
                  ))}
                </ul>
                <form action={createCheckoutSession}>
                  <Button type="submit" className="w-full">Upgrade — 9 CHF/Monat</Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Set up Stripe webhook in dashboard**

In the Stripe dashboard (stripe.com):
1. Go to Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.vercel.app/api/stripe/webhook`
3. Events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy the webhook secret to `.env.local` as `STRIPE_WEBHOOK_SECRET`

- [ ] **Step 6: Commit**

```bash
git add src/lib/stripe.ts src/app/api/stripe/ src/app/settings/
git commit -m "feat: add Stripe subscription with premium gating"
```

---

## Task 14: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/aufsatzmeister.git
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. vercel.com → New Project → Import from GitHub
2. Add all environment variables from `.env.local`
3. Deploy

- [ ] **Step 3: Update Supabase redirect URLs**

In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-project.vercel.app`
- Redirect URLs: `https://your-project.vercel.app/auth/callback`

- [ ] **Step 4: Final smoke test**

```
1. Register new account
2. Complete Module 1 quiz
3. Submit an essay in KI-Coach
4. Complete a Daily Practice
5. Upgrade to Premium via Stripe test card (4242 4242 4242 4242)
6. Verify premium modules unlock
```

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: production deployment configuration"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Lernpfad (5 Module) → Tasks 4, 9
- [x] KI-Coach mit aktivem Feedback + Übungen → Tasks 10, 11
- [x] Daily Practice + Streak → Task 12
- [x] Wortschatz-Trainer → Task 4 (data), Task 9 (linked from Nav)
- [x] Gratis vs Premium gating → Tasks 13, 9 (PremiumGate)
- [x] Dashboard mit Fortschritt → Task 8
- [x] Landing Page + Preise → Task 7
- [x] Stripe Abo → Task 13
- [x] Auth (Login/Register) → Task 6
- [ ] Wortschatz-Trainer UI page → **Gap — add Task 15**

---

## Task 15: Vocabulary Trainer Page (Gap from Self-Review)

**Files:**
- Create: `src/app/vokabular/page.tsx`

- [ ] **Step 1: Create vocabulary page**

```tsx
// src/app/vokabular/page.tsx
'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { getDailyVocab } from '@/data/vocabulary'
import { VocabWord } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, CheckCircle } from 'lucide-react'

export default function VokabularPage() {
  const [words] = useState<VocabWord[]>(getDailyVocab('user', 5))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  const word = words[index]

  function next() {
    if (index < words.length - 1) {
      setIndex(i => i + 1)
      setRevealed(false)
    } else {
      setDone(true)
    }
  }

  const categoryColors: Record<string, string> = {
    verb: 'bg-blue-100 text-blue-800',
    adjective: 'bg-green-100 text-green-800',
    connector: 'bg-purple-100 text-purple-800',
    noun: 'bg-orange-100 text-orange-800',
  }

  if (done) {
    return (
      <div className="flex min-h-screen">
        <Nav />
        <main className="flex-1 p-6 pb-20 md:pb-6 flex items-center justify-center">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Alle Wörter gelernt!</h2>
            <p className="text-zinc-600 mb-6">Morgen gibt es neue Wörter.</p>
            <Button onClick={() => window.location.href = '/dashboard'}>Zurück</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-md">
        <h1 className="text-2xl font-bold mb-2">Wortschatz</h1>
        <p className="text-zinc-500 mb-8">Wort {index + 1} von {words.length}</p>

        <Card className="min-h-48 flex flex-col justify-center items-center text-center p-8 mb-6">
          <CardContent className="p-0">
            <Badge className={`mb-4 ${categoryColors[word.category]}`}>
              {word.category}
            </Badge>
            <h2 className="text-3xl font-bold mb-4">{word.word}</h2>
            {revealed ? (
              <div>
                <p className="text-zinc-700 mb-3">{word.definition}</p>
                <p className="text-sm text-zinc-500 italic">"{word.example}"</p>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setRevealed(true)}>Bedeutung zeigen</Button>
            )}
          </CardContent>
        </Card>

        {revealed && (
          <Button className="w-full" onClick={next}>
            {index < words.length - 1 ? 'Nächstes Wort' : 'Fertig'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/vokabular/
git commit -m "feat: add vocabulary trainer page"
```
