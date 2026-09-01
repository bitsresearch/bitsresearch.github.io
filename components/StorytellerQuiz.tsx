import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

type Storyteller = 'reflector' | 'connector' | 'reframer' | 'maker';

const results: Record<Storyteller, { name: string; line: string; why: string; prompt: string; help: string }> = {
  reflector: { name: 'The Reflector', line: 'You notice moments, memories and change.', why: 'You may use memories, time and change to make sense of university life.', prompt: '“A moment that stayed with me was…”', help: 'What did you notice about yourself?' },
  connector: { name: 'The Connector', line: 'You notice people, conversations and connection.', why: 'People and everyday interactions may shape how university feels for you.', prompt: '“I felt more connected when…”', help: 'Who or what made that moment matter?' },
  reframer: { name: 'The Reframer', line: 'You notice new angles and changing views.', why: 'You may make room for your own view when a familiar story does not quite fit.', prompt: '“I used to think…, but now I see…”', help: 'What helped you see it differently?' },
  maker: { name: 'The Maker', line: 'You turn ideas and feelings into something.', why: 'Words, images, sound and objects may all help you express an experience.', prompt: '“If this part of uni was a…, it would be…”', help: 'Choose a colour, image, sound or object.' },
};

const questions: Array<{ question: string; options: Array<{ type: Storyteller; icon: string; label: string }> }> = [
  { question: 'When something happens, I usually…', options: [{ type: 'reflector', icon: '◒', label: 'think about it' }, { type: 'connector', icon: '⌘', label: 'talk it through' }, { type: 'reframer', icon: '◇', label: 'see it differently' }, { type: 'maker', icon: '≋', label: 'make something' }] },
  { question: 'A good story helps me…', options: [{ type: 'reflector', icon: '◒', label: 'make sense' }, { type: 'connector', icon: '⌘', label: 'connect' }, { type: 'reframer', icon: '◇', label: 'question things' }, { type: 'maker', icon: '≋', label: 'show a feeling' }] },
  { question: 'I am drawn to…', options: [{ type: 'reflector', icon: '◒', label: 'memories' }, { type: 'connector', icon: '⌘', label: 'people' }, { type: 'reframer', icon: '◇', label: 'new views' }, { type: 'maker', icon: '≋', label: 'images and sound' }] },
  { question: 'Something stays with me when…', options: [{ type: 'reflector', icon: '◒', label: 'it feels familiar' }, { type: 'connector', icon: '⌘', label: 'someone matters' }, { type: 'reframer', icon: '◇', label: 'my view changes' }, { type: 'maker', icon: '≋', label: 'I can picture it' }] },
];

type Workshop = { title: string; date: Date; time: string; venue: string; registrationLink: string; emailBooking: string };
const workshopCsv = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSLAX_TguHx2FXd0pxNxM5ViTiTnGnbZPsdrO7KGm98aekIxu4kkHHhAVwM2_W1xiB_WJTbPfSZLet2/pub?output=csv';

const parseCsv = (text: string) => text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean).map(row => {
  const cells: string[] = []; let cell = ''; let quoted = false;
  for (let i = 0; i < row.length; i += 1) { const char = row[i]; if (char === '"') { if (quoted && row[i + 1] === '"') { cell += '"'; i += 1; } else quoted = !quoted; } else if (char === ',' && !quoted) { cells.push(cell); cell = ''; } else cell += char; }
  cells.push(cell); return cells;
});

export const StorytellerQuiz: React.FC = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<Storyteller, number>>({ reflector: 0, connector: 0, reframer: 0, maker: 0 });
  const [winner, setWinner] = useState<Storyteller | null>(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(workshopCsv).then(response => response.ok ? response.text() : Promise.reject()).then(text => {
      const rows = parseCsv(text); const headers = rows.shift()?.map(value => value.trim().toLowerCase()) || [];
      const indexOf = (...names: string[]) => names.map(name => headers.indexOf(name.toLowerCase())).find(index => index >= 0) ?? -1;
      const title = indexOf('Title'); const date = indexOf('Date DD/MM/YYYY', 'Date MM/DD/YYYY', 'Date'); const time = indexOf('Time'); const venue = indexOf('Venue'); const registrationLink = indexOf('Registration Link'); const emailBooking = indexOf('E-mail Booking', 'Email Booking');
      const today = new Date(); today.setHours(0, 0, 0, 0);
      setWorkshops(rows.map(row => {
        const dateText = row[date]?.trim(); const match = dateText?.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); if (!match) return null;
        const parsed = new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
        return parsed >= today ? { title: row[title]?.trim() || 'BITS workshop', date: parsed, time: row[time]?.trim() || 'To be confirmed', venue: row[venue]?.trim() || 'To be confirmed', registrationLink: row[registrationLink]?.trim() || '', emailBooking: row[emailBooking]?.trim() || '' } : null;
      }).filter((item): item is Workshop => item !== null).sort((a, b) => a.date.getTime() - b.date.getTime()));
    }).catch(() => setWorkshops([]));
  }, []);

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
        <div className="border-l-6 border-sage-600 bg-sage-50 p-5 dark:bg-earth-900"><p className="mb-1 text-sm font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">Your closest match</p><h2 id="storyteller-quiz-title" className="mb-2 text-3xl font-serif text-sage-800 dark:text-sage-200">{results[winner].name}</h2><p className="m-0 text-earth-800 dark:text-earth-100">{results[winner].line}</p></div>
        <details className="mt-5 rounded-xl border border-earth-300 bg-white p-4 dark:border-earth-600 dark:bg-earth-900"><summary className="cursor-pointer font-bold text-earth-900 dark:text-earth-50">Why this result?</summary><p className="mb-0 mt-3 text-earth-700 dark:text-earth-200">{results[winner].why}</p></details>
        <div className="mt-5 rounded-xl border-2 border-dashed border-[#9b6b2f] bg-[#fff7dd] p-5 text-earth-900"><h2 className="mb-2 text-2xl font-serif">Your story prompt</h2><p className="text-lg font-bold">{results[winner].prompt}</p><p className="mb-0">{results[winner].help}</p></div>
        <button type="button" onClick={restart} className="mt-5 min-h-12 rounded-xl border-2 border-earth-600 bg-white px-5 py-3 font-bold text-earth-900 hover:bg-earth-100 focus:outline-none focus:ring-2 focus:ring-sage-700 focus:ring-offset-2 dark:bg-earth-900 dark:text-earth-50">Start again</button>
      </div>}
    </section>
    {false && <section className="my-12 border-t border-earth-200 pt-10 dark:border-earth-700" aria-labelledby="quiz-workshops-title">
      <h2 id="quiz-workshops-title" className="mb-3 text-3xl font-serif text-earth-900 dark:text-earth-50">Try it in a workshop</h2>
      <p className="mb-6 text-earth-700 dark:text-earth-200">Bring your result, follow the prompt in your own way, or simply come along to explore. No art skills or pressure to share.</p>
      {workshops.length ? <div className="grid gap-4 md:grid-cols-2">{workshops.map(workshop => <article key={`${workshop.title}-${workshop.date.toISOString()}`} className="rounded-2xl border border-earth-200 bg-white p-5 shadow-sm dark:border-earth-700 dark:bg-earth-800"><h3 className="mb-4 text-xl font-serif font-bold text-earth-900 dark:text-earth-50">{workshop.title}</h3><dl className="space-y-2 text-sm text-earth-800 dark:text-earth-200"><div className="flex gap-2"><dt className="flex items-center gap-1 font-bold"><Calendar size={16} aria-hidden="true" />Date</dt><dd><time dateTime={workshop.date.toISOString().slice(0, 10)}>{workshop.date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</time></dd></div><div className="flex gap-2"><dt className="flex items-center gap-1 font-bold"><Clock size={16} aria-hidden="true" />Time</dt><dd>{workshop.time}</dd></div><div className="flex gap-2"><dt className="flex items-center gap-1 font-bold"><MapPin size={16} aria-hidden="true" />Venue</dt><dd>{workshop.venue}</dd></div></dl>{workshop.registrationLink ? <a href={workshop.registrationLink} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-sage-700 px-4 py-3 font-bold text-white no-underline hover:bg-sage-800 focus:outline-none focus:ring-2 focus:ring-sage-700 focus:ring-offset-2">Book My Place <ArrowRight size={16} aria-hidden="true" /></a> : workshop.emailBooking ? <a href={workshop.emailBooking} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-earth-400 px-4 py-3 font-bold text-earth-800 no-underline hover:bg-earth-100 dark:text-earth-100">Email to Book <ArrowRight size={16} aria-hidden="true" /></a> : <p className="mt-5 mb-0 font-semibold text-earth-700 dark:text-earth-200">Booking opens soon</p>}</article>)}</div> : <p className="rounded-xl bg-earth-100 p-5 text-earth-800 dark:bg-earth-800 dark:text-earth-100">Workshop details are loading or will be announced soon. <a href="/#upcoming-workshops">View all workshops</a>.</p>}
    </section>}
  </>;
};
