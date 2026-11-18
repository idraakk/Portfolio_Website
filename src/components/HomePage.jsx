import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CodeXml, Maximize2, Minimize2, Play } from 'lucide-react';

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
import ContactSh from '@/components/ContactSh.jsx';
import PortfolioPreview from '@/components/PortfolioPreview.jsx';
import PaneDivider from '@/components/PaneDivider.jsx';

const DEFAULT_EDITOR_SHARE = 36;
const DEFAULT_EXPLORER_WIDTH = 184;

const sectionMap = {
  about: AboutMd,
  experience: ExperienceJson,
  education: EducationYml,
  skills: SkillsTs,
  projects: ProjectsTsx,
  contact: ContactSh,
};

const HomePage = () => {
  const { activeId, reopenAll, sidebarOpen } = useWorkspace();
  const [view, setView] = useState('split');
  const [runRequest, setRunRequest] = useState(null);
  const [editorShare, setEditorShare] = useState(DEFAULT_EDITOR_SHARE);
  const [explorerWidth, setExplorerWidth] = useState(DEFAULT_EXPLORER_WIDTH);
  useHotkeys();

  useEffect(() => {
    if (runRequest) {
      document.getElementById(`portfolio-${runRequest.section}`)?.scrollIntoView({ block: 'start' });
    }
  }, [runRequest]);

  function runPortfolio() {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setView('preview');
    } else if (view === 'editor') {
      setView('split');
    }
    setRunRequest({ section: activeId ?? 'about' });
  }

  const Section = sectionMap[activeId];

  return (
    <>
      <div className="h-dvh w-full flex flex-col bg-[var(--chrome-titlebar)] text-[var(--chrome-fg)] overflow-hidden">
        <TitleBar onRun={runPortfolio} />
        {view !== 'preview' && (
          <p className="portfolio-run-hint">
            Tap <strong>Run</strong> to open the portfolio <ArrowUpRight size={15} aria-hidden="true" />
          </p>
        )}

        <div className="relative flex-1 flex min-h-0">
          <main
            className="portfolio-workspace"
            data-view={view}
            style={{ '--editor-share': `${editorShare}cqi`, '--explorer-width': `${explorerWidth}px` }}
          >
            <div className="portfolio-explorer">
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
              <section id="portfolio-editor" className="portfolio-editor bg-[var(--syntax-bg)]" aria-label="Code editor">
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

              <section id="portfolio-output" className="portfolio-output" aria-label="Portfolio preview">
                <div className="portfolio-output-bar">
                  <Play size={13} aria-hidden="true" />
                  <span>Portfolio preview</span>
                  <span className="portfolio-output-status">Running</span>
                  <div className="portfolio-output-controls">
                    <button type="button" onClick={() => setView('editor')}>
                      <CodeXml size={15} aria-hidden="true" /> Editor
                    </button>
                    <button
                      type="button"
                      className="portfolio-view-expand"
                      aria-label={view === 'preview' ? 'Restore split view' : 'Expand preview'}
                      title={view === 'preview' ? 'Restore split view' : 'Expand preview'}
                      onClick={() => setView(view === 'preview' ? 'split' : 'preview')}
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
