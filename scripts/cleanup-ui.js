import fs from 'fs';
import path from 'path';

const uiDir = '/vercel/share/v0-project/components/ui';

// Delete UI components directory
if (fs.existsSync(uiDir)) {
  fs.rmSync(uiDir, { recursive: true, force: true });
  console.log('[v0] Deleted components/ui directory');
} else {
  console.log('[v0] components/ui directory does not exist');
}

console.log('[v0] Cleanup complete!');
