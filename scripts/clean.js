const fs = require('fs');
const path = require('path');

const targets = [
  path.join(process.cwd(), 'reports', 'newman'),
  path.join(process.cwd(), 'public'),
];

for (const target of targets) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
  fs.mkdirSync(target, { recursive: true });
}

console.log('Cleaned report and public output directories.');
