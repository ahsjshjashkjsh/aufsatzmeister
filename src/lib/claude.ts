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
