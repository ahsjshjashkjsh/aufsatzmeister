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
