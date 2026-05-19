import { chromium, type Browser, type LaunchOptions } from 'playwright';
import { existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

export function detectBravePath(): string | null {
  const platform = os.platform();

  if (platform === 'linux') {
    const candidates = [
      '/usr/bin/brave',
      '/usr/bin/brave-browser',
      '/usr/local/bin/brave',
      '/usr/local/bin/brave-browser',
      '/snap/bin/brave',
    ];

    for (const p of candidates) {
      if (existsSync(p)) return p;
    }

    try {
      const whichPath = execSync('which brave 2>/dev/null || which brave-browser 2>/dev/null', {
        encoding: 'utf-8',
      }).trim();
      if (whichPath && existsSync(whichPath)) return whichPath;
    } catch {
      // which not available or Brave not in PATH
    }

    return null;
  }

  if (platform === 'darwin') {
    const candidates = [
      '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      (process.env.HOME ?? '') + '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    ];

    for (const p of candidates) {
      if (existsSync(p)) return p;
    }

    return null;
  }

  if (platform === 'win32') {
    const candidates = [
      path.join(process.env.LOCALAPPDATA || '', 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
      path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
      path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
    ];

    for (const p of candidates) {
      if (p && existsSync(p)) return p;
    }

    return null;
  }

  return null;
}

export async function launchBrave(options?: LaunchOptions): Promise<Browser> {
  const overridePath = process.env.BRAVE_PATH;
  const bravePath = overridePath || detectBravePath();

  if (!bravePath) {
    throw new Error(
      'Brave browser not found.\n' +
      'Install Brave: https://brave.com\n' +
      'Then retry, or set BRAVE_PATH environment variable to the Brave executable path.'
    );
  }

  return chromium.launch({
    ...options,
    executablePath: bravePath,
  });
}
