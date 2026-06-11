import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button, Tag } from '../../components';
import type { BusinessUnitImpact, ChatMessage, Obligation, RegulatoryChange } from '../../types';
import type { ReportContent } from '../../lib/report';
import { delay } from '../../lib/delay';
import { formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';

const SUGGESTED_QUESTIONS = [
  'What actions are required for my Business Unit?',
  "What's the implementation deadline?",
  'What evidence do I need to upload?',
  'Can you summarize the key requirements?',
];

interface ResolveArgs {
  change: RegulatoryChange;
  content: ReportContent;
  obligations: Obligation[];
  impact?: BusinessUnitImpact;
}

interface Answer {
  text: string;
  section: string;
}

function resolveAnswer(question: string, { change, content, obligations, impact }: ResolveArgs): Answer {
  const q = question.toLowerCase();
  const bu = impact?.businessUnit ?? 'your Business Unit';
  if (q.includes('action') || q.includes('do')) {
    return {
      text: `For ${bu}, the required actions are:\n• ${content.requiredActions.join('\n• ')}`,
      section: 'What you need to do',
    };
  }
  if (q.includes('deadline') || q.includes('when') || q.includes('date')) {
    return {
      text: `The implementation deadline is ${formatDate(change.implementationDueDate)}. The regulation becomes effective on ${formatDate(change.effectiveDate)}, so all controls should be in place before then.`,
      section: 'Key Dates',
    };
  }
  if (q.includes('evidence') || q.includes('upload')) {
    return {
      text: `For audit readiness you will need to upload:\n• ${content.evidenceRequired.join('\n• ')}`,
      section: 'Evidence required for audit',
    };
  }
  if (q.includes('summar') || q.includes('requirement') || q.includes('key')) {
    return {
      text: `${content.executiveSummary}\n\nKey obligations:\n• ${obligations.map((o) => o.text).join('\n• ')}`,
      section: 'Obligations & Requirements',
    };
  }
  return {
    text: `${content.executiveSummary}\n\nAsk me about required actions, the deadline, evidence to upload, or a summary of the key requirements.`,
    section: 'Report overview',
  };
}

export interface AdvisoryChatbotProps {
  change: RegulatoryChange;
  content: ReportContent;
  obligations: Obligation[];
  impact?: BusinessUnitImpact;
  currentDate: string;
  onTranscriptChange?: (messages: ChatMessage[]) => void;
}

export function AdvisoryChatbot({
  change,
  content,
  obligations,
  impact,
  currentDate,
  onTranscriptChange,
}: AdvisoryChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [citations, setCitations] = useState<Record<string, string>>({});
  const [thinking, setThinking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState('');

  const idRef = useRef(0);
  const aliveRef = useRef(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    onTranscriptChange?.(messages);
  }, [messages, onTranscriptChange]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const nextId = () => `m${++idRef.current}`;
  const stamp = `${currentDate}T00:00:00`;

  const ask = async (question: string) => {
    if (busy) return;
    setBusy(true);
    setMessages((m) => [...m, { id: nextId(), role: 'user', text: question, timestamp: stamp }]);
    setThinking(true);
    await delay(900);
    if (!aliveRef.current) return;
    setThinking(false);

    const answer = resolveAnswer(question, { change, content, obligations, impact });
    const aiId = nextId();
    setMessages((m) => [...m, { id: aiId, role: 'ai', text: '', timestamp: stamp }]);
    setCitations((c) => ({ ...c, [aiId]: answer.section }));

    const { text } = answer;
    for (let i = 2; i <= text.length; i += 2) {
      if (!aliveRef.current) return;
      const slice = text.slice(0, i);
      setMessages((m) => m.map((x) => (x.id === aiId ? { ...x, text: slice } : x)));
      await delay(12);
    }
    if (!aliveRef.current) return;
    setMessages((m) => m.map((x) => (x.id === aiId ? { ...x, text } : x)));
    setBusy(false);
  };

  const submitDraft = () => {
    const q = draft.trim();
    if (!q || busy) return;
    setDraft('');
    void ask(q);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-slim pr-1">
        {messages.length === 0 && !thinking && (
          <div className="rounded-2xl border border-accent-100 bg-accent-50/50 p-4">
            <div className="flex items-center gap-2 text-accent-700">
              <Sparkles size={16} />
              <span className="text-sm font-semibold">Advisory Assistant</span>
            </div>
            <p className="mt-1.5 text-sm text-slate-600">
              Ask me anything about <span className="font-medium">{change.title}</span>. I answer
              from the communication report and obligation mapping for {impact?.businessUnit ?? 'your Business Unit'}.
            </p>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-700 px-3.5 py-2.5 text-sm text-white">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[90%]">
                <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
                  {msg.text}
                  {busy && !msg.text.endsWith('.') && (
                    <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-slate-400 align-middle" />
                  )}
                </div>
                {citations[msg.id] && msg.text && (
                  <div className="mt-1.5">
                    <Tag tone="accent" size="sm">
                      Source: {citations[msg.id]}
                    </Tag>
                  </div>
                )}
              </div>
            </div>
          ),
        )}

        {thinking && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5">
              <span className="inline-flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-thinking-bounce"
                    style={{ animationDelay: `${i * 0.16}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            disabled={busy}
            onClick={() => ask(q)}
            className={cn(
              'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors',
              'hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
              busy && 'cursor-not-allowed opacity-50',
            )}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitDraft();
          }}
          placeholder="Ask a question…"
          className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        <Button icon={Send} onClick={submitDraft} disabled={busy || !draft.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
