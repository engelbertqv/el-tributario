/* apply-paths.js
 * Injects baseUrl + path aliases into tsconfig.json (naive, supports JSON with comments).
 * Usage: node frontend/scripts/apply-paths.js
 */
const fs = require('fs');
const path = require('path');
const tsconfigPath = path.join(process.cwd(), 'frontend', 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  console.error('[apply-paths] tsconfig.json not found at frontend/tsconfig.json');
  process.exit(1);
}
let text = fs.readFileSync(tsconfigPath, 'utf8');
const hasBaseUrl = /"baseUrl"\s*:/.test(text);
const hasPaths = /"paths"\s*:/.test(text);
if (hasBaseUrl && hasPaths) {
  console.log('[apply-paths] baseUrl & paths already present. No changes.');
  process.exit(0);
}
text = text.replace(
  /("compilerOptions"\s*:\s*\{)/,
  `$1\n    "baseUrl": "src",\n    "paths": {\n      "@app/*": ["app/*"],\n      "@core/*": ["app/core/*"],\n      "@pages/*": ["app/pages/*"]\n    },`
);
fs.writeFileSync(tsconfigPath, text);
console.log('[apply-paths] Injected baseUrl and paths into frontend/tsconfig.json');
