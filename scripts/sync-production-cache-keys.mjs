import fs from 'node:fs';
import crypto from 'node:crypto';

const indexPath='index.html';
const bootstrapPath='assets/js/production-ranking-bootstrap.js';
const tracked=[
  'assets/data/ranking-data.js',
  'assets/data/display-overrides.js',
  'assets/data/era-filter-data.js',
  'assets/js/fighter-tagline-system.js',
  'assets/js/card-nicknames.js',
  'assets/data/ranking-data-patches.js',
  bootstrapPath,
  'assets/data/play-data.js',
  'assets/js/play.js',
  'assets/js/app-profile.js',
  'assets/js/app-update-watcher.js'
];

function hashFor(file){
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
}

const bootstrap=fs.readFileSync(bootstrapPath,'utf8');
const count=Number(bootstrap.match(/EXPECTED_FIGHTER_COUNT=(\d+)/)?.[1]||0);
const version=bootstrap.match(/const VERSION='([^']+)'/)?.[1]||'production-ranking-bootstrap';
if(!count)throw new Error('Unable to resolve EXPECTED_FIGHTER_COUNT from production bootstrap.');

let html=fs.readFileSync(indexPath,'utf8');
const replacements=[];
for(const file of tracked){
  if(!fs.existsSync(file))continue;
  const escaped=file.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const pattern=new RegExp(`(${escaped})(?:\\?v=[^"']*)?`,'g');
  const value=`${file}?v=${hashFor(file)}`;
  const before=html;
  html=html.replace(pattern,value);
  if(html!==before)replacements.push({file,value});
}

const build=`${version}-build-${count}`;
html=html.replace(/(<meta name="app-build" content=")[^"]*(" \/>)/,`$1${build}$2`);
fs.writeFileSync(indexPath,html);
console.log(JSON.stringify({build,count,replacements},null,2));
