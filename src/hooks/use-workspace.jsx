import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { FILES } from '@/data/cv.js';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [openTabs, setOpenTabs] = useState(FILES.map((f) => f.id));
  const [activeId, setActiveId] = useState(FILES[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches) { setSidebarOpen(false); setTerminalOpen(false); }
  }, []);

  const openFile = useCallback((id) => {
    if (!FILES.some((f) => f.id === id)) return;
    setOpenTabs((tabs) => (tabs.includes(id) ? tabs : [...tabs, id]));
    setActiveId(id);
  }, []);

  const closeTab = useCallback(
    (id) => {
      setOpenTabs((tabs) => {
        const next = tabs.filter((t) => t !== id);
        if (activeId === id) setActiveId(next[0] ?? null);
        return next;
      });
    },
    [activeId],
  );

  const reopenAll = useCallback(() => {
    setOpenTabs(FILES.map((f) => f.id));
    setActiveId(FILES[0].id);
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const toggleTerminal = useCallback(() => setTerminalOpen((v) => !v), []);
  const togglePalette = useCallback(() => setPaletteOpen((v) => !v), []);

  const activeFile = useMemo(
    () => FILES.find((f) => f.id === activeId) || FILES[0],
    [activeId],
  );

  const value = {
    files: FILES,
    openTabs,
    activeId,
    activeFile,
    openFile,
    closeTab,
    reopenAll,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    terminalOpen,
    setTerminalOpen,
    toggleTerminal,
    paletteOpen,
    setPaletteOpen,
    togglePalette,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}
