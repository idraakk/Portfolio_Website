import React from 'react';

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

const HomePage = () => {
  const { activeId, reopenAll } = useWorkspace();
  useHotkeys();

  const sectionMap = {
    about: AboutMd,
    experience: ExperienceJson,
    education: EducationYml,
    skills: SkillsTs,
    projects: ProjectsTsx,
    contact: ContactSh,
  };

  return (
    <>
      <div className="h-dvh w-full flex flex-col bg-[var(--chrome-titlebar)] text-[var(--chrome-fg)] overflow-hidden">
        <TitleBar />

        <div className="relative flex-1 flex min-h-0">
          <ActivityBar />
          <FileExplorer />

          <main className="flex-1 flex flex-col min-w-0 bg-[var(--syntax-bg)]">
            <EditorTabs />

            <div className="flex-1 min-h-0 overflow-y-auto">
              {(() => {
                const Section = sectionMap[activeId];
                return Section ? <Section key={activeId} /> : <div className="p-8 text-center"><p>No files open.</p><button onClick={reopenAll} className="mt-4 underline">Reopen portfolio files</button></div>;
              })()}
            </div>

            <Terminal />
          </main>
        </div>

        <StatusBar />
        <CommandPalette />
      </div>
    </>
  );
};

export default HomePage;
