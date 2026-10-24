# Idraak Mohd Khan - Portfolio

A VS Code-inspired portfolio using React, React Router, Vite, and Tailwind CSS.

## Run on Windows

Requires Node.js 22.12 or later (tested with Node 24).

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the URL printed by Vite, normally http://localhost:5173/Portfolio_Website/. In PowerShell,
`npm.cmd` avoids the script execution-policy error from `npm.ps1`.
On macOS/Linux, use `npm` instead.

## Production and checks

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start
```

This is a static React Router app. Deploy only `build/client`; no running Node
server or database is required. `npm.cmd run start` previews the built site at
http://127.0.0.1:3000/Portfolio_Website/ (local preview only).

## GitHub Pages deployment

1. In `idraakk/Portfolio_Website`, open Settings > Pages.
2. Under Build and deployment, select GitHub Actions as the source.
3. Commit these changes and push to `main`.
4. Open Actions > Deploy portfolio to GitHub Pages and wait for build/deploy to succeed.
5. Visit https://idraakk.github.io/Portfolio_Website/.

Every push to `main` triggers deployment. You can also use Actions > Run workflow.
The workflow builds and uploads `build/client`; do not commit build output.
GitHub Free requires a public repository for Pages.

The Vite base, React Router basename, and browser tests use `/Portfolio_Website/`.
Resume and favicon links use Vite's base URL automatically. If you later connect
a custom domain, change both config paths to `/`, update the sitemap URL and test
expectations, then rebuild. The unused server API route has been removed, and
`public/sitemap.xml` replaces the dynamic sitemap.

Browser tests use an installed Microsoft Edge browser:

```powershell
npm.cmd run test:e2e
```

Build first. Tests start a static preview automatically; port 3000 must be free.
They cover navigation, profile links, theme persistence, closing/reopening all tabs,
mobile Explorer, viewport overflow, resume delivery, sitemap, favicon, and GitHub Pages asset paths.

## Personalize

- `src/data/cv.js`: identity, experience, education, skills, projects, and profile links.
- `public/resume.pdf`: downloadable resume.
- `src/index.css`: three themes and editor styling.
- `src/components/`: the six portfolio sections and editor interface.