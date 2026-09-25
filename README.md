# Idraak Mohd Khan - Portfolio

A VS Code-inspired portfolio using React, React Router, Vite, and Tailwind CSS.

## Run on Windows

Requires Node.js 22.12 or later (tested with Node 24).

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by Vite, normally http://localhost:5173. In PowerShell,
`npm.cmd` avoids the script execution-policy error from `npm.ps1`.
On macOS/Linux, use `npm` instead.

## Production and checks

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

Production normally serves at http://localhost:3000. This is a server-rendered
React Router app: deploy both `build/client` and `build/server` with a Node server.
No environment variables or external database are required.

Browser tests use an installed Microsoft Edge browser:

```powershell
npm.cmd run test:e2e
```

Build first. Tests start the production server automatically if port 3000 is free.
They cover navigation, profile links, theme persistence, closing/reopening all tabs,
mobile Explorer, viewport overflow, resume delivery, sitemap, and API 404 responses.

## Personalize

- `src/data/cv.js`: identity, experience, education, skills, projects, and profile links.
- `public/resume.pdf`: downloadable resume.
- `src/index.css`: three themes and editor styling.
- `src/components/`: the six portfolio sections and editor interface.