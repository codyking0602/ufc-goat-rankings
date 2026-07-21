import fs from 'node:fs';

const source=fs.readFileSync('assets/js/picks-commissioner.js','utf8');
console.log(JSON.stringify({
  file:'assets/js/picks-commissioner.js',
  encoding:'base64',
  source:Buffer.from(source,'utf8').toString('base64')
},null,2));
