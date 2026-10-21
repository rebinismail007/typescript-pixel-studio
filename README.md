# Pixel Studio — TypeScript / React / Next.js

A tiny 16 × 16 pixel-art editor. Draw an odd little character, flood-fill it, rotate it, and export a sharp SVG. This is a **new portfolio experiment**, not an older school assignment.

## Try it

Requires Node.js 24+.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Click squares to draw; native buttons also support keyboard navigation. The drawing saves in this browser. Export SVG for an image, or JSON to reopen an editable drawing.

## What is implemented

- Immutable TypeScript drawing operations and a bounded undo/redo reducer.
- Queue-based flood fill with explicit row-boundary handling.
- Rotation, mirroring, custom colours and validated JSON import.
- SVG generation from validated hex colours; transparent empty pixels.
- React client editor, Next.js App Router and `/api/palette` JSON route.
- Responsive layout, labelled controls and localStorage failure handling.

## Check it

```sh
npm test
npm run typecheck
npm run build
```

Four tests exercise fill boundaries, transforms, history branching, and malicious/invalid import data. The editor intentionally has no accounts, collaboration or server-side drawing storage. Click painting is supported; continuous pointer-drag strokes are outside this small example.
