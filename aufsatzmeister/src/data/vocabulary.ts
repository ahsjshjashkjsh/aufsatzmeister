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
  const today = new Date().toDateString()
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const start = seed % VOCABULARY.length
  const result: VocabWord[] = []
  for (let i = 0; i < count; i++) {
    result.push(VOCABULARY[(start + i) % VOCABULARY.length])
  }
  return result
}
