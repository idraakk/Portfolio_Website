import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, CodeXml, Maximize2, Minimize2, Play } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';

import { useWorkspace } from '@/hooks/use-workspace.jsx';
import { useHotkeys } from '@/hooks/use-hotkeys.jsx';
import TitleBar from '@/components/TitleBar.jsx';
import ActivityBar from '@/components/ActivityBar.jsx';
import FileExplorer from '@/components/FileExplorer.jsx';
import EditorTabs from '@/components/EditorTabs.jsx';
import StatusBar from '@/components/StatusBar.jsx';
import Terminal from '@/components/Terminal.jsx';
import CommandPalette from '@/components/CommandPalette.jsx';
import AboutMd from '@/components/AboutMd.jsx';
import ExperienceJson from '@/components/ExperienceJson.jsx';
import EducationYml from '@/components/EducationYml.jsx';
import SkillsTs from '@/components/SkillsTs.jsx';
import ProjectsTsx from '@/components/ProjectsTsx.jsx';
import ProductsMd from '@/components/ProductsMd.jsx';
import ContactSh from '@/components/ContactSh.jsx';
import PortfolioPreview from '@/components/PortfolioPreview.jsx';
import PaneDivider from '@/components/PaneDivider.jsx';
import { productReturnKind } from '@/lib/product-navigation.js';

const DEFAULT_EDITOR_SHARE = 36;
const DEFAULT_EXPLORER_WIDTH = 184;
const COMPACT_PREVIEW = '(max-width: 1023px)';

const sectionMap = {
  about: AboutMd,
  experience: ExperienceJson,
  education: EducationYml,
  skills: SkillsTs,
  projects: ProjectsTsx,
  products: ProductsMd,
  contact: ContactSh,
};

const HomePage = () => {
  const { activeId, reopenAll, sidebarOpen } = useWorkspace();
  const location = useLocation();
  const navigate = useNavigate();
  const historyPreview = location.state?.portfolioPreview === true;
  const historySection = location.state?.previewSection;
  const [view, setView] = useState(() =>
    typeof window !== 'undefined' && productReturnKind(location.search) && window.matchMedia(COMPACT_PREVIEW).matches
      ? 'preview'
      : 'split',
  );
  const [closingPreview, setClosingPreview] = useState(false);
  const [runRequest, setRunRequest] = useState(null);
  const [editorShare, setEditorShare] = useState(DEFAULT_EDITOR_SHARE);
  const [explorerWidth, setExplorerWidth] = useState(DEFAULT_EXPLORER_WIDTH);
  const outputRef = useRef(null);
  const runButtonRef = useRef(null);
  const wasInPreviewHistory = useRef(false);
  const restoreSplit = useRef(false);
  useHotkeys();

  useEffect(() => {
    if (runRequest) {
      document.getElementById(`portfolio-${runRequest.section}`)?.scrollIntoView({ block: 'start' });
    }
  }, [runRequest]);

  useEffect(() => {
    if (!closingPreview) return;
    const exit = outputRef.current?.getAnimations().find((animation) => animation.animationName === 'portfolio-panel-leave');
    let canceled = false;
    const finish = () => {
      if (canceled) return;
      setClosingPreview(false);
      setView('editor');
      runButtonRef.current?.focus({ preventScroll: true });
    };
    if (exit) exit.finished.then(finish, finish);
    else finish();
    return () => { canceled = true; };
  }, [closingPreview]);

  const showEditor = useCallback(() => {
    if (window.matchMedia(COMPACT_PREVIEW).matches && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      setClosingPreview(true);
    } else {
      setView('editor');
      runButtonRef.current?.focus({ preventScroll: true });
    }
  }, []);

  useEffect(() => {
    if (historyPreview) {
      setClosingPreview(false);
      setView('preview');
      if (historySection) setRunRequest({ section: historySection });
    } else if (wasInPreviewHistory.current) {
      if (restoreSplit.current) setView('split');
      else showEditor();
      restoreSplit.current = false;
    }
    wasInPreviewHistory.current = historyPreview;
  }, [historyPreview, historySection, showEditor]);

  function openFullPreview(section) {
    navigate(
      { pathname: location.pathname, search: window.location.search, hash: location.hash },
      { state: { portfolioPreview: true, previewSection: section }, preventScrollReset: true },
    );
  }

  function closePreview() {
    if (historyPreview) navigate(-1);
    else showEditor();
  }

  function toggleExpandedPreview() {
    if (historyPreview) {
      restoreSplit.current = true;
      navigate(-1);
    } else {
      openFullPreview();
    }
  }

  function runPortfolio() {
    setClosingPreview(false);
    if (window.matchMedia(COMPACT_PREVIEW).matches && !historyPreview) {
      openFullPreview(activeId ?? 'about');
      return;
    }
    if (view === 'editor') {
      setView('split');
    }
    setRunRequest({ section: activeId ?? 'about' });
  }

  const Section = sectionMap[activeId];

  return (
    <>
      <div className="portfolio-shell h-dvh w-full flex flex-col bg-[var(--chrome-titlebar)] text-[var(--chrome-fg)] overflow-hidden">
        <TitleBar onRun={runPortfolio} runButtonRef={runButtonRef} />
        <div className="relative flex-1 flex min-h-0">
          <main
            className="portfolio-workspace"
            data-view={view}
            data-preview-closing={closingPreview || undefined}
            style={{ '--editor-share': `${editorShare}cqi`, '--explorer-width': `${explorerWidth}px` }}
          >
            <p className="portfolio-run-hint" aria-hidden={view === 'preview' || undefined}>
              Tap <strong>Run</strong> to open the portfolio <ArrowUpRight size={15} aria-hidden="true" />
            </p>
            <div className="portfolio-explorer" inert={view === 'preview'} aria-hidden={view === 'preview' || undefined}>
              <ActivityBar />
              <FileExplorer />
            </div>

            {view === 'split' && sidebarOpen && (
              <PaneDivider
                label="Resize file explorer"
                paneId="portfolio-file-explorer"
                min={150}
                max={270}
                step={12}
                unit="px"
                value={explorerWidth}
                defaultValue={DEFAULT_EXPLORER_WIDTH}
                onChange={setExplorerWidth}
              />
            )}

            <div className="portfolio-panes">
              <section id="portfolio-editor" className="portfolio-editor bg-[var(--syntax-bg)]" aria-label="Code editor" inert={view === 'preview'} aria-hidden={view === 'preview' || undefined}>
                <EditorTabs />

                <div className="flex-1 min-h-0 overflow-y-auto">
                  {Section ? <Section key={activeId} /> : (
                    <div className="p-8 text-center">
                      <p>No files open.</p>
                      <button type="button" onClick={reopenAll} className="mt-4 underline">Reopen portfolio files</button>
                    </div>
                  )}
                </div>

                <Terminal />
              </section>

              {view === 'split' && (
                <PaneDivider
                  label="Resize editor and preview"
                  paneId="portfolio-editor"
                  min={24}
                  max={48}
                  step={2}
                  unit="%"
                  value={editorShare}
                  defaultValue={DEFAULT_EDITOR_SHARE}
                  onChange={setEditorShare}
                />
              )}

              <section id="portfolio-output" ref={outputRef} className="portfolio-output" aria-label="Portfolio preview" inert={closingPreview}>
                <div className="portfolio-output-bar">
                  <Play size={13} aria-hidden="true" />
                  <span>Portfolio preview</span>
                  <span className="portfolio-output-status">Running</span>
                  <div className="portfolio-output-controls">
                    <button type="button" onClick={closePreview}>
                      <CodeXml size={15} aria-hidden="true" /> Editor
                    </button>
                    <button
                      type="button"
                      className="portfolio-view-expand"
                      aria-label={view === 'preview' ? 'Restore split view' : 'Expand preview'}
                      title={view === 'preview' ? 'Restore split view' : 'Expand preview'}
                      onClick={toggleExpandedPreview}
                    >
                      {view === 'preview' ? <Minimize2 size={14} aria-hidden="true" /> : <Maximize2 size={14} aria-hidden="true" />}
                    </button>
                  </div>
                </div>
                <PortfolioPreview />
              </section>
            </div>
          </main>
        </div>

        <StatusBar />
        <CommandPalette />
      </div>
    </>
  );
};

export default HomePage;
