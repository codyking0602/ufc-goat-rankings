const fs = require('node:fs');
const path = require('node:path');

const file = path.join(process.cwd(), 'assets/data/ranking-data.js');
const records = {
  'Jon Jones': '16-0, 1 NC',
  'Georges St-Pierre': '14-1',
  'Demetrious Johnson': '12-1-1',
  'Anderson Silva': '16-2',
  'Islam Makhachev': '10-0',
  'Alexander Volkanovski': '9-4',
  'Khabib Nurmagomedov': '8-0',
  'Jose Aldo': '7-1',
  'Matt Hughes': '12-3',
  'Kamaru Usman': '10-2',
  'Stipe Miocic': '7-2',
  'Israel Adesanya': '12-3',
  'Daniel Cormier': '8-2',
  'Alex Pereira': '7-1',
  'Randy Couture': '5-2',
  'Max Holloway': '14-6',
  'Cain Velasquez': '5-1',
  'B.J. Penn': '6-2',
  'Chuck Liddell': '10-1',
  'T.J. Dillashaw': '8-3',
  'Frankie Edgar': '9-6-1',
  'Ilia Topuria': '4-1',
  'Henry Cejudo': '4-0',
  'Charles Oliveira': '5-1',
  'Junior dos Santos': '9-2',
  'Conor McGregor': '6-1',
  'Tyron Woodley': '7-3-1',
  'Merab Dvalishvili': '6-1',
  'Tito Ortiz': '7-2',
  'Francis Ngannou': '6-0',
  'Dricus du Plessis': '4-1',
  'Dominick Cruz': '4-1',
  'Petr Yan': '7-4',
  'Deiveson Figueiredo': '4-2-1',
  'Khamzat Chimaev': '6-1',
  'Dustin Poirier': '9-5, 1 NC',
  'Aljamain Sterling': '9-2',
  'Robbie Lawler': '7-2',
  'Robert Whittaker': '10-4',
  'Tony Ferguson': '8-1',
  'Justin Gaethje': '9-5',
  'Lyoto Machida': '8-4',
  'Brock Lesnar': '4-1',
  "Sean O'Malley": '5-2',
  'Sean Strickland': '7-4',
  'Michael Bisping': '7-4',
  'Dan Henderson': '4-5',
  'Chael Sonnen': '4-4',
  'Amanda Nunes': '11-1',
  'Valentina Shevchenko': '12-2-1',
  'Zhang Weili': '6-2',
  'Ronda Rousey': '6-0',
  'Joanna Jedrzejczyk': '6-2',
  'Rose Namajunas': '5-2',
  'Jessica Andrade': '5-3',
  'Kayla Harrison': '3-0',
  'Alexa Grasso': '4-1-1',
  'Carla Esparza': '5-3',
  'Julianna Peña': '3-2',
  'Holly Holm': '5-5',
  'Miesha Tate': '5-1',
  'Mackenzie Dern': '6-4'
};

let source = fs.readFileSync(file, 'utf8');
const marker = '  "primeRecords": {';
const start = source.indexOf(marker);
if (start < 0) throw new Error('primeRecords map not found');
const end = source.indexOf('\n  }\n};', start);
if (end < 0) throw new Error('primeRecords map end not found');
let section = source.slice(start, end);

for (const [fighter, record] of Object.entries(records)) {
  const escaped = fighter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`("${escaped}": \\{\\s*"record": ")[^"]+(" )?`, 'm');
  const exactPattern = new RegExp(`("${escaped}": \\{\\s*"record": ")[^"]+("[,\\n])`, 'm');
  if (!exactPattern.test(section)) throw new Error(`Prime Record entry not found: ${fighter}`);
  section = section.replace(exactPattern, `$1${record}$2`);
}

source = source.slice(0, start) + section + source.slice(end);
source = source.replace(
  '// Prime Record source of truth: RANKING_DATA.primeRecords, preserving the reviewed profile-facing records.',
  '// Prime Record source of truth: RANKING_DATA.primeRecords, using audited prime-window fight counts with reviewed exceptions.'
);
fs.writeFileSync(file, source, 'utf8');
fs.unlinkSync(__filename);
console.log(`Corrected ${Object.keys(records).length} canonical Prime Records.`);
