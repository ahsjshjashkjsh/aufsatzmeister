# AufsatzMeister — Design Spec
**Datum:** 2026-04-01
**Status:** Approved

---

## Produktidee

AufsatzMeister ist eine Web-App die Schüler im deutschsprachigen Raum (Schweiz, Deutschland, Österreich) lehrt wie man gute Aufsätze schreibt. Das Ziel ist nicht passive Korrektur, sondern aktives Lernen durch tägliche Praxis — sodass Schüler nach 30 Tagen messbar besser schreiben.

**Kernproblem:** Schüler bekommen schlechte Noten in Deutsch weil sie nicht wissen wie man Aufsätze strukturiert, die Grammatik beherrscht und einen starken Wortschatz einsetzt. Bestehendes Feedback von Lehrern oder Tools wie Grammarly ist passiv — Schüler lesen es durch und ändern nichts nachhaltig.

**Lösung:** Eine strukturierte Lernplattform die Theorie, aktives KI-Feedback mit Übungen, und tägliche Praxis kombiniert.

---

## Zielgruppe

- **Primär:** Schüler 12–20 Jahre in der Schweiz, Deutschland, Österreich
- **Sprache:** Hochdeutsch (kein Schweizerdeutsch)
- **Schmerz:** Schlechte Noten in Deutsch, unsicher beim Aufsatzschreiben
- **Zahlungsbereitschaft:** Wenn Note von 3 auf 5 steigt, sind 9 CHF/Monat ein Schnäppchen

---

## Kernfunktionen

### 1. Strukturierter Lernpfad
Module die Schritt für Schritt aufeinander aufbauen:

1. Aufsatzarten (Erörterung, Beschreibung, Bericht, Erzählung)
2. Aufbau & Struktur (Einleitung, Hauptteil, Schluss)
3. Grammatik (Satzstellung, Kommaregeln, Zeitformen)
4. Stil & Ausdruck (Satzvariationen, Übergänge, Kohärenz)
5. Wortschatz (starke Verben, Adjektive, Synonyme)

Jedes Modul endet mit einem kurzen Abschlusstest. Fortschritt wird gespeichert.

### 2. KI-Coach — Aktives Feedback
Schüler tippen oder laden ihren Aufsatz hoch. Die KI analysiert ihn und gibt Feedback in drei Schritten — **nicht** einfach "du hast X falsch":

- **Schritt 1 — Erklärung:** Konkrete Regel mit Beispiel erklärt
- **Schritt 2 — Mini-Übung:** 3 kurze Aufgaben zum gleichen Thema — erst wenn richtig beantwortet geht es weiter
- **Schritt 3 — Wortschatz-Boost:** Schwache Wörter werden durch stärkere Alternativen ersetzt, Schüler tippt sie ab um sie zu verinnerlichen

Ziel: Schüler lernt aktiv aus dem Fehler statt ihn passiv zu überlesen.

### 3. Daily Practice
- 5–10 Minuten täglich
- Aufgabentypen: Komma setzen, richtiges Wort wählen, Satz verbessern, neues Vokabular lernen
- Streak-System zur Motivation (wie Duolingo)
- Tägliche Push-Benachrichtigung / E-Mail Erinnerung

### 4. Wortschatz-Trainer
- Täglich 5 neue Wörter mit Beispielsätzen
- Spaced-Repetition: Wörter die man nicht kann kommen öfter
- Kontextbezogen zum aktuellen Lernmodul

---

## Seitenstruktur

### Öffentlich (kein Login)
- **Startseite** — Value Proposition, wie es funktioniert, Testimonials, Preise
- **Demo** — 1 kostenloses Modul ausprobieren ohne Registrierung

### Nach Login
- **Dashboard** — Tagesstreak, Fortschrittsbalken, nächste empfohlene Aufgabe
- **Lernpfad** — Module in Reihenfolge, Fortschritt pro Modul sichtbar
- **KI-Coach** — Aufsatz eingeben, Feedback erhalten, Übungen lösen
- **Wortschatz-Trainer** — Tagesvokabular, Wiederholungen
- **Daily Practice** — Tagesübung (5 Min)

### Premium-only
- Alle Module freigeschaltet (Gratis: nur Modul 1)
- Unbegrenzte KI-Feedback Analysen (Gratis: 1/Monat)
- Fortschrittsreport als PDF (zum Zeigen an Eltern/Lehrer)

---

## Monetarisierung

| Plan | Preis | Inhalt |
|------|-------|--------|
| **Gratis** | 0 CHF | Modul 1 + 1 KI-Feedback/Monat + tägliche Übungen |
| **Premium** | 9 CHF/Monat | Alle Module + unbegrenzt KI-Feedback + PDF-Report |

**Verkaufsargument:** "Wenn deine Note steigt, zahlt sich das Abo aus dem ersten besseren Zeugnis zurück."

---

## Alleinstellungsmerkmal (USP)

- **Nicht Grammarly:** Kein passiver Korrekturservice — aktives Lernen durch Übungen
- **Nicht ChatGPT:** Schreibt nicht für dich — lehrt dich selbst besser zu schreiben
- **Nicht Duolingo:** Kein Sprachenlernen für Anfänger — gezielt Aufsatzkompetenz für Schüler
- **Schüler-fokussiert:** Hochdeutsch, auf Schulfächer und Aufsatztypen aus dem DACH-Lehrplan ausgerichtet

---

## Technischer Stack (Empfehlung)

- **Frontend:** Next.js (React) — Web-App, Mobile-freundlich
- **Backend:** Node.js / Supabase (Datenbank + Auth)
- **KI:** Claude API (Anthropic) für Aufsatz-Analyse und Feedback
- **Payments:** Stripe für Abo-Verwaltung
- **Hosting:** Vercel

---

## Erfolgskriterien

- Nach 30 Tagen täglicher Nutzung schreibt der Schüler messbar besser (Eigeneinschätzung + Noten)
- Retention: Schüler nutzen die App mind. 5x/Woche
- Conversion: 10% der Gratis-Nutzer werden Premium
