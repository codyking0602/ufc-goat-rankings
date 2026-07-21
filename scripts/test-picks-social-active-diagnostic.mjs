import fs from 'node:fs';

try{
  await import('./test-picks-social-active-owner.mjs');
}catch(error){
  const source='/tmp/picks-social-active-owner-report.json';
  const target='/tmp/picks-social-identity-owner-report.json';
  if(fs.existsSync(source))fs.copyFileSync(source,target);
  throw error;
}
