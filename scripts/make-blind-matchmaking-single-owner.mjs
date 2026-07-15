import fs from 'node:fs';

const playPath='assets/js/play.js';
let play=fs.readFileSync(playPath,'utf8');
const oldMode="if(mode === 'blind' && !state.blindPair) nextBlindRound();";
const newMode="if(mode === 'blind' && !window.UFC_BLIND_MATCHMAKING && !state.blindPair) nextBlindRound();";
const oldRefresh="if(state.mode === 'blind' && state.blindPair && !state.blindChoice) renderBlind();";
const newRefresh="if(state.mode === 'blind' && !window.UFC_BLIND_MATCHMAKING && state.blindPair && !state.blindChoice) renderBlind();";
if(!play.includes(oldMode))throw new Error('Legacy blind setMode branch not found.');
if(!play.includes(oldRefresh))throw new Error('Legacy blind refresh branch not found.');
play=play.replace(oldMode,newMode).replace(oldRefresh,newRefresh);
if(play.includes(oldMode)||play.includes(oldRefresh))throw new Error('Legacy blind rendering ownership remains.');
fs.writeFileSync(playPath,play,'utf8');

const indexPath='index.html';
let index=fs.readFileSync(indexPath,'utf8');
const oldScript=/assets\/js\/play\.js\?v=[^"]+/;
if(!oldScript.test(index))throw new Error('Play script tag not found.');
index=index.replace(oldScript,'assets/js/play.js?v=play-js-20260715a-five-round-blind-owner');
fs.writeFileSync(indexPath,index,'utf8');
console.log('Five-round Blind Resume is now the single renderer.');
