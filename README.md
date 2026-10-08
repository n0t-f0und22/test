# LaunchDarkly Node.js Demo

A minimal Express service wired to the LaunchDarkly Node.js server-side SDK
(`@launchdarkly/node-server-sdk`).

## Setup

Requires Node.js 20.6 or newer (`npm start` uses `--env-file-if-exists`).

```bash
npm install
cp .env.example .env
```

Then open `.env` and set `LAUNCHDARKLY_SDK_KEY`. Find the value in LaunchDarkly
under **Project settings → Environments** (project `default`). Use the
**server-side SDK key** — not the client-side ID or mobile key. `.env` is
gitignored; never commit the real value.

The server exits with code 1 if the key is missing.

## Run

```bash
npm start      # http://localhost:3000  (override with PORT)
npm run check  # syntax check only
```

## How it works

`server.js` creates a single `LDClient` at startup and awaits
`waitForInitialization({ timeout: 5 })` **before** `app.listen`, so no request is
served with fallback values while the SDK is still connecting. If initialization
fails the error is logged and the server still starts — flags then serve their
fallback values. `SIGINT`/`SIGTERM` close the client before exit.

`GET /` evaluates the flag `my-first-flag` and returns one of two greetings.

## Placeholders to replace

Two values are demo stand-ins:

- **`my-first-flag`** (`server.js:23`) does not exist yet. Create a boolean flag
  with that key in project `default`, or point the call at an existing flag.
  Until it exists, every evaluation returns the `false` fallback and the greeting
  never changes.
- **`example-user-key`** (`server.js:19`) is a hardcoded context key, so every
  evaluation looks like the same user. Replace it with a real per-request
  identifier before this feeds any targeting rule, segment, or experiment.
