import React, { useRef, useState } from 'react';

type Storyteller = 'reflector' | 'connector' | 'reframer' | 'maker';

const results: Record<Storyteller, { name: string; icon: string; intro: string; paragraphs: string[]; prompt: string; workshopLink: string }> = {
  reflector: { name: 'The Reflector', icon: '◒', intro: 'You are someone who notices the moments that stay with you.', paragraphs: ['A small conversation, an unexpected feeling, or a change in your routine can give you something to think about. You may like taking a little time to work out what an experience means—and how it connects to where you have been or where you are going.', 'Your stories can help you spot change, make sense of your journey, and notice what matters to you.'], prompt: 'A moment that stayed with me was…', workshopLink: 'If that prompt gives you something to think about, you can explore it at a BITS workshop in your own way—through words, pictures, collage, audio, or simply quiet reflection. No art skills or pressure to share.' },
  connector: { name: 'The Connector', icon: '⌘', intro: 'You are someone who notices the people around a story.', paragraphs: ['A message, shared joke, kind gesture or difficult conversation can shape how university feels. You may make sense of things by talking, listening, remembering who was there, or noticing when you felt part of something.', 'Your stories can show the connections that support you—and the ones you are still looking for.'], prompt: 'I felt more connected when…', workshopLink: 'If that prompt brings someone or something to mind, a BITS workshop gives you space to explore it without needing to explain everything out loud. You can use words, images, collage, audio, or your phone.' },
  reframer: { name: 'The Reframer', icon: '◇', intro: 'You are someone who looks for another way of seeing things.', paragraphs: ['You may notice when the usual story does not quite fit your experience. Perhaps something you expected about university has changed, or you have found a different way to understand a challenge, yourself, or what comes next.', 'Your stories can make room for your own perspective. You do not have to accept the first version of a story.'], prompt: 'I used to think…, but now I see…', workshopLink: 'If you would like to explore that shift further, bring it to a BITS workshop. You can try out ideas privately, make something small, or simply see what emerges—there is no right answer and no pressure to share.' },
  maker: { name: 'The Maker', icon: '≋', intro: 'You are someone who turns ideas and feelings into something you can see, hear or share.', paragraphs: ['Sometimes a colour, photo, song, drawing, collage, voice note or meme says more than a long explanation. You may enjoy trying things out and letting the form of your story help you discover what it means.', 'Your stories do not need to look polished. Making something is already a way of exploring.'], prompt: 'If this part of uni was a…, it would be…', workshopLink: 'If you feel like making that idea real, a BITS workshop is a relaxed place to experiment. Use whichever materials or format feels comfortable for you—no art skills, finished piece, or sharing required.' },
};

const questions: Array<{ question: string; options: Array<{ type: Storyteller; icon: string; label: string }> }> = [
  { question: 'When something happens, I usually…', options: [{ type: 'reflector', icon: '◒', label: 'think about it' }, { type: 'connector', icon: '⌘', label: 'talk it through' }, { type: 'reframer', icon: '◇', label: 'see it differently' }, { type: 'maker', icon: '≋', label: 'make something' }] },
  { question: 'A good story helps me…', options: [{ type: 'reflector', icon: '◒', label: 'make sense' }, { type: 'connector', icon: '⌘', label: 'connect' }, { type: 'reframer', icon: '◇', label: 'question things' }, { type: 'maker', icon: '≋', label: 'show a feeling' }] },
  { question: 'I am drawn to…', options: [{ type: 'reflector', icon: '◒', label: 'memories' }, { type: 'connector', icon: '⌘', label: 'people' }, { type: 'reframer', icon: '◇', label: 'new views' }, { type: 'maker', icon: '≋', label: 'images and sound' }] },
  { question: 'Something stays with me when…', options: [{ type: 'reflector', icon: '◒', label: 'it feels familiar' }, { type: 'connector', icon: '⌘', label: 'someone matters' }, { type: 'reframer', icon: '◇', label: 'my view changes' }, { type: 'maker', icon: '≋', label: 'I can picture it' }] },
];

export const StorytellerQuiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Storyteller, number>>({ reflector: 0, connector: 0, reframer: 0, maker: 0 });
  const [winner, setWinner] = useState<Storyteller | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const choose = (type: Storyteller) => {
    const nextScores = { ...scores, [type]: scores[type] + 1 };
    if (step + 1 === questions.length) {
      setScores(nextScores); setWinner((Object.keys(nextScores) as Storyteller[]).sort((a, b) => nextScores[b] - nextScores[a])[0]);
      window.setTimeout(() => resultRef.current?.focus(), 0);
    } else { setScores(nextScores); setStep(step + 1); }
  };

  const restart = () => { setStep(0); setScores({ reflector: 0, connector: 0, reframer: 0, maker: 0 }); setWinner(null); };
  const current = questions[step];

  return <>
    <section className="my-9 rounded-3xl border-2 border-earth-800 bg-[#fffdf6] p-5 shadow-[5px_5px_0_#b4c4b7] sm:p-8 dark:border-earth-100 dark:bg-earth-800" aria-labelledby="storyteller-quiz-title">
      {!winner ? <>
        <div className="mb-3 flex items-center justify-between gap-4 text-sm font-bold text-earth-800 dark:text-earth-100"><span id="storyteller-quiz-title">Your quiz</span><span aria-live="polite">{step + 1} of {questions.length}</span></div>
        <div className="mb-7 h-2.5 overflow-hidden rounded-full bg-earth-200 dark:bg-earth-700" aria-hidden="true"><span className="block h-full bg-sage-600 transition-[width] motion-reduce:transition-none" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        <h2 className="mb-5 text-2xl font-serif leading-snug text-earth-900 dark:text-earth-50">{current.question}</h2>
        <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={current.question}>{current.options.map(option => <button key={option.type} type="button" onClick={() => choose(option.type)} className="min-h-12 rounded-xl border-2 border-earth-600 bg-white p-4 text-left font-bold text-earth-900 transition-colors hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-700 focus:ring-offset-2 dark:border-earth-400 dark:bg-earth-900 dark:text-earth-50 dark:hover:bg-earth-700"><span className="mr-2 text-lg text-sage-700 dark:text-sage-300" aria-hidden="true">{option.icon}</span>{option.label}</button>)}</div>
      </> : <div ref={resultRef} tabIndex={-1} className="outline-none">
        <div className="border-l-6 border-sage-600 bg-sage-50 p-5 dark:bg-earth-900">
          <p className="mb-1 text-sm font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">Your storyteller result</p>
          <h2 id="storyteller-quiz-title" className="mb-0 text-3xl font-serif text-sage-800 dark:text-sage-200">{results[winner].name} <span aria-hidden="true">{results[winner].icon}</span></h2>
        </div>
        <div className="mt-5 space-y-4 text-earth-800 dark:text-earth-100">
          <p className="text-lg font-bold leading-relaxed">{results[winner].intro}</p>
          {results[winner].paragraphs.map(paragraph => <p key={paragraph} className="leading-relaxed">{paragraph}</p>)}
        </div>
        <div className="mt-6 rounded-xl border-2 border-dashed border-[#9b6b2f] bg-[#fff7dd] p-5 text-earth-900">
          <h3 className="mb-2 text-2xl font-serif">Try this</h3>
          <p className="mb-0 text-lg font-bold italic">“{results[winner].prompt}”</p>
        </div>
        <div className="mt-6 rounded-xl bg-sage-50 p-5 text-earth-900 dark:bg-earth-900 dark:text-earth-100">
          <p className="mb-0 leading-relaxed">{results[winner].workshopLink}</p>
          <a href="#upcoming-workshops" className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-sage-700 px-4 py-3 font-bold text-white no-underline hover:bg-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-700 focus:ring-offset-2">Explore upcoming workshops</a>
        </div>
        <button type="button" onClick={restart} className="mt-5 min-h-12 rounded-xl border-2 border-earth-600 bg-white px-5 py-3 font-bold text-earth-900 hover:bg-earth-100 focus:outline-none focus:ring-2 focus:ring-sage-700 focus:ring-offset-2 dark:bg-earth-900 dark:text-earth-50">Start again</button>
      </div>}
    </section>
  </>;
};
