# Idraak Mohd Khan - Portfolio

A VS Code-inspired portfolio using React, React Router, Vite, and Tailwind CSS.

## Run on Windows

Requires Node.js 22.12 or later (tested with Node 24).

```powershell
cd idraak_final_codebase
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
- `public/resume.pdf`: downloadable resume (copied from the supplied Resume1.pdf).
- `src/index.css`: three themes and editor styling.
- `src/components/`: the six portfolio sections and editor interface.

Profile links were recovered from the resume. Project descriptions and repository
URLs were retained from the supplied personalized codebase; the resume does not
independently document those personal projects. Confirm them before publishing.
The lecture-assistant and BrandFluence links currently lead to your GitHub profile;
replace them with specific repositories when available. Calendar booking is hidden
until `contact.calendar` is set to a real booking URL.

## Repair notes

The original ZIP passes CRC validation, but contains `server/index.js",`.
A quotation mark cannot appear in a Windows filename. Its contents are a fragment
of pasted package metadata, not a usable server entry. The extracted fragment is
preserved as `server/extraction-fragment.txt`; it is not executed. There was no
`index.ts` entry in the supplied ZIP. The actual `build/server/index.js` is generated
by `npm.cmd run build` and must not be reconstructed from that fragment.

Other repairs include missing package dependencies and a reproducible lockfile,
React Router's `src` app directory, JSX file extension, stray TXT headings in CSS
configuration, missing API/sitemap helpers, original-owner contact text, placeholder
social/calendar links, mobile layout, keyboard-accessible tabs, empty-tab state,
working project/resume links, and terminal clear/replay/close controls.

The terminal is a scripted portfolio demonstration, not an executable shell.
The original reference did not supply a license file; confirm template reuse terms
before distributing publicly. No hosting or publication was performed.

The retained Tailwind 3 build-tool dependency tree has npm audit advisories
(5 high, 2 moderate at repair time). Resolving them requires a separate Tailwind 4
migration; a forced breaking upgrade was not applied during this repair.
