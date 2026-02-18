# Dara by SAGENT — AI Docs Platform

Unified mortgage servicing document management platform with three integrated services:

- **AI Docs** — Batch upload, Pyro AI document classification/extraction, document viewer, processing reports, file index templates
- **Advanced Recon** — Corporate advance reconciliation, invoice-to-ledger matching, AI-assisted CSV mapping
- **Doc Audit** — Loan tape vs. document comparison, SOT version management, field-level accept/flag/override

## Prerequisites

- **Node.js** (v18+) and **npm**

## Installation & Running

```bash
npm install && npm run dev
```

This starts both the backend proxy and the Vite frontend dev server.

## Project Structure

- `frontend/` — React 18 + TypeScript + Vite application
- `frontend/components/` — All UI components organized by service
- `frontend/types.ts` — Shared TypeScript type definitions
- `frontend/constants.ts` — Mock data for all services
- `frontend/docs/Gaps.md` — Feature gap spec & implementation tracker
- `backend/` — Node.js/Express proxy for Google Cloud API calls
