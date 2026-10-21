# TypeScript Survey Dashboard - React and Next.js

An interactive team feedback dashboard with typed responses, department filters,
score summaries and a local check-in form. Built with the Next.js App Router,
React server/client components and responsive CSS.

New AI-assisted learning project, October 2026. Every response is synthetic;
this is not a prior client or employer project.

## Run

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Change the team filter, add a check-in and reload:
browser storage keeps the local changes. Use **Reset demo** to restore the
sample. Invalid saved data and blocked browser storage display a useful message.

```sh
npm test
npm run typecheck
npm run build
npm start
```

## Structure

- `lib/surveys.ts`: types, runtime input validation and immutable scoring logic.
- `app/page.tsx`: server-rendered page with deterministic initial data.
- `app/components/Dashboard.tsx`: interactive React component and local storage.
- `app/api/surveys/route.ts`: read-only JSON demo endpoint; supports
  `?department=Product` and rejects unknown departments.
- `tests`: filtering, empty states, invalid ratings and duplicate submissions.

Browser submissions are not sent to the JSON endpoint or to the separate C#
project. This app deliberately runs independently. Authentication, durable
multi-user storage and a backend connection are possible next steps.
