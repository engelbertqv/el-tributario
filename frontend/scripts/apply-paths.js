/* apply-paths.js
 * Injects baseUrl + paths into tsconfig.json (supports JSON with comments in a naive way).
 * Usage: node scripts/apply-paths.js
 */
const fs = require('fs');
const path = require('path');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
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
console.log('[apply-paths] Injected baseUrl and paths into tsconfig.json');
