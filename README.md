# playwright-brave

[![npm version](https://img.shields.io/npm/v/playwright-brave.svg)](https://www.npmjs.com/package/playwright-brave)
[![npm downloads](https://img.shields.io/npm/dm/playwright-brave.svg)](https://www.npmjs.com/package/playwright-brave)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Playwright doesn't support Brave browser out of the box.** [Official Playwright docs](https://playwright.dev/docs/intro) list Chrome, Chromium, Edge, Firefox, and WebKit — but not Brave.

This package fixes that.

## Installation

```bash
npm install playwright-brave
```

Requires `playwright` as a peer dependency. If you don't have it:

```bash
npm install playwright
npx playwright install chromium
```

## Quick Start

```javascript
import { launchBrave } from 'playwright-brave';

const browser = await launchBrave();
const page = await browser.newPage();
await page.goto('https://example.com');
console.log(await page.title()); // "Example Domain"
await browser.close();
```

That's it. Brave works with Playwright now.

## API

### `launchBrave(options?)`

Launches Brave browser. Accepts the same [`LaunchOptions`](https://playwright.dev/docs/api/class-browsertype#browser-type-launch) as `chromium.launch()`.

```typescript
import { launchBrave } from 'playwright-brave';

// Default — auto-detects Brave path
const browser = await launchBrave();

// With options — same as chromium.launch()
const browser = await launchBrave({ headless: false, slowMo: 100 });
```

### `detectBravePath()`

Returns the detected Brave executable path, or `null` if not found.

```typescript
import { detectBravePath } from 'playwright-brave';

const path = detectBravePath(); // "/usr/bin/brave" or null
```

### Environment Variable Override

Set `BRAVE_PATH` to override auto-detection:

```bash
BRAVE_PATH=/custom/path/to/brave node script.js
```

## Works With

This package is a thin wrapper over Playwright — it works with any tool that can run Node.js:

- **[OpenCode](https://opencode.ai)** — AI coding assistant
- **[Claude Code](https://github.com/anthropics/anthropic-quickstarts/tree/main/claude-code)** — Anthropic's CLI agent
- **[Codex](https://github.com/openai/codex)** — OpenAI's CLI agent
- **[Gemini CLI](https://github.com/google-gemini/gemini-cli)** — Google's CLI agent
- **Any Node.js project** — no AI tool required

## Why This Exists

Playwright bundles its own Chromium, Firefox, and WebKit builds. Brave is a separate Chromium-based browser that Playwright doesn't ship or support natively. This package bridges that gap by:

1. **Finding Brave** on your system (Linux, macOS, Windows)
2. **Passing the correct path** to Playwright's Chromium launcher
3. **Giving clear errors** if Brave isn't installed

All Chromium-specific features (DevTools protocol, contexts, pages, screenshots) work identically — because under the hood, it's still Playwright's Chromium engine.

## Peer Dependency Design

This package declares `playwright` as a peer dependency. When Microsoft updates Playwright, your project automatically gets the new version — no waiting for us to publish a compatible release.

```json
{
  "peerDependencies": {
    "playwright": ">=1.40.0"
  }
}
```

## Links

- [Playwright Documentation](https://playwright.dev/)
- [Brave Browser](https://brave.com/)
- [npm package](https://www.npmjs.com/package/playwright-brave)
- [Source code](https://github.com/shhhubin/playwright-brave)
- [Report issues](https://github.com/shhhubin/playwright-brave/issues)

## License

MIT
