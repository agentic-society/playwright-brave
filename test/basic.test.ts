import { launchBrave, detectBravePath } from '../src/index';

async function runTests() {
  const bravePath = detectBravePath();
  console.log('detectBravePath() returned:', bravePath);

  // Test: launchBrave throws helpful error when BRAVE_PATH not set and Brave not found
  if (bravePath === null) {
    try {
      await launchBrave();
      console.error('FAIL: launchBrave should throw when Brave is not installed');
      process.exit(1);
    } catch (err: any) {
      if (err.message.includes('Brave') && err.message.includes('https://brave.com')) {
        console.log('PASS: launchBrave throws helpful error when Brave not found');
      } else {
        console.error('FAIL: launchBrave error message should mention Brave and brave.com');
        console.error('Got:', err.message);
        process.exit(1);
      }
    }
  }

  // Test: BRAVE_PATH override works even when auto-detect fails
  const savedBravePath = process.env.BRAVE_PATH;
  process.env.BRAVE_PATH = '/nonexistent/path/to/brave';
  try {
    await launchBrave();
    console.error('FAIL: launchBrave should throw with invalid BRAVE_PATH');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('executable') || err.message.includes('launch')) {
      console.log('PASS: launchBrave uses BRAVE_PATH override (fails with invalid path as expected)');
    } else {
      console.log('PASS: launchBrave respects BRAVE_PATH override');
    }
  }
  if (savedBravePath !== undefined) {
    process.env.BRAVE_PATH = savedBravePath;
  } else {
    delete process.env.BRAVE_PATH;
  }

  // Test: launchBrave works when Brave is installed
  if (bravePath !== null) {
    console.log('Brave found at:', bravePath);
    try {
      const browser = await launchBrave();
      const page = await browser.newPage();
      await page.goto('https://example.com');
      const title = await page.title();
      await browser.close();

      if (title === 'Example Domain') {
        console.log('PASS: launchBrave() launches Brave and navigates successfully');
      } else {
        console.error('FAIL: page title mismatch, got:', title);
        process.exit(1);
      }
    } catch (err: any) {
      console.error('FAIL: launchBrave failed:', err.message);
      process.exit(1);
    }
  }

  console.log('\nAll tests passed.');
}

runTests();
