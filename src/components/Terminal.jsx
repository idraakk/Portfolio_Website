import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown, GripHorizontal, Plus, Trash2, X } from 'lucide-react';
import PaneDivider from '@/components/PaneDivider.jsx';
import { useWorkspace } from '@/hooks/use-workspace.jsx';
import { cv } from '@/data/cv.js';

const PROMPT = `${cv.identity.handle}@portfolio`;

const buildScript = () => [
  { kind: 'cmd', text: 'whoami' },
  {
    kind: 'out',
    text: `${cv.identity.role} · ${cv.identity.location} · ${cv.identity.availabilityNote}`,
  },
  { kind: 'cmd', text: 'cat skills.ts | head' },
  {
    kind: 'out',
    text: `${cv.skills.languages.slice(0, 3).join(' · ')} · ${cv.skills.frontend.slice(0, 2).join(' · ')} · ${cv.skills.backend.slice(0, 2).join(' · ')}`,
  },
  { kind: 'cmd', text: 'cat availability.json' },
  {
    kind: 'out',
    text: `{ "status": "${cv.identity.available ? 'open' : 'busy'}", "next": "${cv.identity.availabilityNote}" }`,
  },
  { kind: 'cmd', text: 'echo "Let\'s build something"' },
  { kind: 'out', text: `reach out: ${cv.contact.email}` },
];

const TYPING_SPEED = 22;
const PAUSE_BETWEEN = 350;
const MIN_TERMINAL_HEIGHT = 64;

export default function Terminal() {
  const { terminalOpen, toggleTerminal } = useWorkspace();
  const [rendered, setRendered] = useState([]);
  const [typingLine, setTypingLine] = useState('');
  const [replay, setReplay] = useState(0);
  const [done, setDone] = useState(false);
  const [preferredHeight, setPreferredHeight] = useState(null);
  const [terminalSize, setTerminalSize] = useState(null);
  const terminalRef = useRef(null);
  const scriptRef = useRef(buildScript());
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!terminalOpen) return;
    const editor = terminalRef.current.parentElement;
    const measure = () => {
      if (!editor.clientHeight) return;
      const max = Math.max(MIN_TERMINAL_HEIGHT, editor.clientHeight - 108);
      const defaultHeight = window.matchMedia('(min-width: 1024px)').matches
        ? 224
        : Math.min(192, Math.max(112, Math.round(window.innerHeight * 0.24)));
      setTerminalSize({ max, defaultHeight: Math.min(max, defaultHeight) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(editor);
    return () => observer.disconnect();
  }, [terminalOpen]);

  useEffect(() => {
    if (!terminalOpen) return;
    let timer;
    const tick = () => {
      const script = scriptRef.current;
      const i = indexRef.current;
      if (i >= script.length) {
        setDone(true);
        return;
      }
      const item = script[i];
      if (item.kind === 'out') {
        setRendered((r) => [...r, item]);
        indexRef.current += 1;
        timer = setTimeout(tick, PAUSE_BETWEEN);
        return;
      }
      const c = charRef.current;
      if (c < item.text.length) {
        charRef.current = c + 1;
        setTypingLine(item.text.slice(0, c + 1));
        timer = setTimeout(tick, TYPING_SPEED);
      } else {
        setRendered((r) => [...r, item]);
        setTypingLine('');
        charRef.current = 0;
        indexRef.current += 1;
        timer = setTimeout(tick, PAUSE_BETWEEN);
      }
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, [terminalOpen, replay]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [rendered, typingLine]);

  if (!terminalOpen) {
    return (
      <button
        onClick={toggleTerminal}
        className="h-7 shrink-0 px-3 flex items-center gap-2 bg-[var(--chrome-tabbar)] border-t border-[var(--chrome-border)] text-[11px] text-[var(--chrome-fg-muted)] hover:text-[var(--chrome-fg)]"
      >
        <ChevronUp className="w-3.5 h-3.5" />
        Show terminal
      </button>
    );
  }

  const maxHeight = terminalSize?.max ?? 224;
  const defaultHeight = terminalSize?.defaultHeight ?? 224;
  const height = Math.min(preferredHeight ?? defaultHeight, maxHeight);

  return (
    <div
      id="portfolio-terminal"
      ref={terminalRef}
      role="region"
      aria-label="Terminal"
      className="h-[clamp(7rem,24dvh,12rem)] lg:h-56 shrink-0 flex flex-col bg-[var(--chrome-terminal)] border-t border-[var(--chrome-border)]"
      style={terminalSize ? { height } : undefined}
    >
      <div className="h-8 shrink-0 flex items-stretch bg-[var(--chrome-tabbar)] border-b border-[var(--chrome-border)] text-[11px] text-[var(--chrome-fg-muted)]">
        <PaneDivider
          label="Resize terminal"
          paneId="portfolio-terminal"
          orientation="horizontal"
          min={MIN_TERMINAL_HEIGHT}
          max={maxHeight}
          value={height}
          defaultValue={defaultHeight}
          step={16}
          unit="px"
          onChange={setPreferredHeight}
        >
          <span className="px-2.5 leading-6 border-b-2 border-[var(--accent)] text-[var(--chrome-fg)]">Terminal</span>
          <GripHorizontal size={16} aria-hidden="true" />
        </PaneDivider>
        <div className="flex items-center gap-1 pr-2">
          <span className="hidden md:inline px-2 text-[10px]">zsh — {PROMPT}</span>
          <button className="p-1 hover:bg-[var(--chrome-hover)] rounded" title="Replay terminal" onClick={() => { indexRef.current = 0; charRef.current = 0; setRendered([]); setTypingLine(''); setDone(false); setReplay((n) => n + 1); }}>
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-[var(--chrome-hover)] rounded" title="Clear terminal" onClick={() => { setRendered([]); setTypingLine(''); indexRef.current = scriptRef.current.length; setDone(true); }}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleTerminal}
            className="p-1 hover:bg-[var(--chrome-hover)] rounded"
            title="Hide terminal"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:bg-[var(--chrome-hover)] rounded" title="Close" onClick={toggleTerminal}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-[12.5px] leading-[20px]">
        {rendered.map((l, i) =>
          l.kind === 'cmd' ? (
            <div key={i} className="flex">
              <span className="text-[var(--syntax-fn)] shrink-0">{PROMPT}</span>
              <span className="text-[var(--syntax-comment)] mx-1 shrink-0">~</span>
              <span className="text-[var(--syntax-string)] mx-1 shrink-0">%</span>
              <span className="text-[var(--syntax-fg)]">{l.text}</span>
            </div>
          ) : (
            <div key={i} className="text-[var(--syntax-fg)] opacity-90 pl-1">
              {l.text}
            </div>
          ),
        )}
        {!done && typingLine && (
          <div className="flex">
            <span className="text-[var(--syntax-fn)] shrink-0">{PROMPT}</span>
            <span className="text-[var(--syntax-comment)] mx-1 shrink-0">~</span>
            <span className="text-[var(--syntax-string)] mx-1 shrink-0">%</span>
            <span className="text-[var(--syntax-fg)]">{typingLine}</span>
            <span className="ml-0.5 inline-block w-2 h-4 bg-[var(--syntax-fg)] animate-pulse align-middle" />
          </div>
        )}
        {done && (
          <div className="flex">
            <span className="text-[var(--syntax-fn)] shrink-0">{PROMPT}</span>
            <span className="text-[var(--syntax-comment)] mx-1 shrink-0">~</span>
            <span className="text-[var(--syntax-string)] mx-1 shrink-0">%</span>
            <span className="ml-0.5 inline-block w-2 h-4 bg-[var(--syntax-fg)] animate-pulse align-middle" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
