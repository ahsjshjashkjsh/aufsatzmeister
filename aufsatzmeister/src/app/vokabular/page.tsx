'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { getDailyVocab } from '@/data/vocabulary'
import { VocabWord } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, CheckCircle } from 'lucide-react'

const categoryColors: Record<string, string> = {
  verb: 'bg-blue-100 text-blue-800',
  adjective: 'bg-green-100 text-green-800',
  connector: 'bg-purple-100 text-purple-800',
  noun: 'bg-orange-100 text-orange-800',
}

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
