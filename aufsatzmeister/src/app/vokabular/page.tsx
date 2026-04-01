'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { getDailyVocab } from '@/data/vocabulary'
import { VocabWord } from '@/types'
import { Button } from '@/components/ui/button'
import { ChevronRight, CheckCircle, BookMarked, Eye } from 'lucide-react'

const categoryStyles: Record<string, { bg: string; text: string; label: string }> = {
  verb:      { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Verb' },
  adjective: { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Adjektiv' },
  connector: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Verbindungswort' },
  noun:      { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Nomen' },
}

export default function VokabularPage() {
  const [words] = useState<VocabWord[]>(getDailyVocab('user', 5))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(false)

  const word = words[index]
  const style = categoryStyles[word?.category] ?? { bg: 'bg-stone-100', text: 'text-stone-700', label: word?.category }

  function next() {
    if (index < words.length - 1) { setIndex(i => i + 1); setRevealed(false) }
    else setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFFBF5]">
        <Nav />
        <main className="pt-20 pb-28 md:pb-12 px-4 md:px-6 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-2">Alle Wörter gelernt!</h2>
            <p className="text-stone-400 mb-8">Morgen gibt es neue Wörter. Gut gemacht!</p>
            <Button onClick={() => window.location.href = '/dashboard'} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8">
              Zurück zum Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />

      <main className="pt-20 pb-28 md:pb-12 px-4 md:px-6 max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookMarked className="h-5 w-5 text-purple-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">Wortschatz</h1>
        </div>
        <p className="text-stone-400 text-sm mb-6 ml-[52px]">Wort {index + 1} von {words.length}</p>

        <div className="flex gap-2 mb-8">
          {words.map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < index ? 'bg-green-400' : i === index ? 'bg-orange-500' : 'bg-stone-200'}`} />
          ))}
        </div>

        <div className={`rounded-3xl border-2 transition-all mb-6 overflow-hidden ${revealed ? 'border-orange-200' : 'border-stone-200'}`}>
          <div className="bg-white p-8 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-5 ${style.bg} ${style.text}`}>{style.label}</span>
            <h2 className="text-4xl font-extrabold text-stone-900 mb-2">{word.word}</h2>
          </div>
          {revealed ? (
            <div className="bg-orange-50 border-t-2 border-orange-100 p-6 text-center">
              <p className="text-stone-700 font-medium mb-3">{word.definition}</p>
              <p className="text-sm text-stone-400 italic">„{word.example}"</p>
            </div>
          ) : (
            <div className="bg-stone-50 border-t-2 border-stone-100 p-5 text-center">
              <button onClick={() => setRevealed(true)} className="flex items-center gap-2 mx-auto text-stone-500 hover:text-orange-600 transition-colors font-medium text-sm">
                <Eye className="h-4 w-4" /> Bedeutung zeigen
              </button>
            </div>
          )}
        </div>

        {revealed && (
          <Button onClick={next} className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base">
            {index < words.length - 1 ? 'Nächstes Wort' : 'Fertig'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </main>
    </div>
  )
}
