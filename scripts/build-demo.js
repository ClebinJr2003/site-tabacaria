
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dest = path.join(root, 'public');

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

const arquivos = [
  'index.html',
  'admin.html',
  'favicon.ico',
  'css',
  'js',
  'images',
  'assets'
];

for (const item of arquivos) {
  const src = path.join(root, item);

  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(dest, item), {
      recursive: true
    });
  }
}

console.log('Loja e painel administrativo copiados para public/');
