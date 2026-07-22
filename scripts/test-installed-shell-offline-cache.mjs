import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const rawSource=fs.readFileSync('sw.js','utf8');
const source=rawSource.replace("const SUPABASE_SCRIPT_TIMEOUT_MS=3200;","const SUPABASE_SCRIPT_TIMEOUT_MS=25;");
const scope='https://example.test/ufc-goat-rankings/';
const NativeRequest=globalThis.Request;
const NativeResponse=globalThis.Response;

class ScopedRequest extends NativeRequest{
  constructor(input,init={}){
    const value=typeof input==='string'
      ? new URL(input,scope).href
      : input instanceof NativeRequest
        ? input
        : new URL(String(input?.url||input),scope).href;
    super(value,init);
  }
}

function createRuntime(){
  const handlers=new Map();
  const stores=new Map();
  const fetchLog=[];
  let networkMode='online';
  let supabaseMode='online';

  const requestFor=input=>input instanceof NativeRequest?input:new ScopedRequest(input);
  const keyFor=input=>requestFor(input).url;

  class MemoryCache{
    constructor(){this.entries=new Map();}
    async add(input){
      const request=requestFor(input);
      const response=await fetchImpl(request);
      if(!response?.ok)throw new Error(`Could not cache ${request.url}`);
      await this.put(request,response);
    }
    async put(input,response){this.entries.set(keyFor(input),response.clone());}
    async match(input,options={}){
      const key=keyFor(input);
      const exact=this.entries.get(key);
      if(exact)return exact.clone();
      if(!options.ignoreSearch)return undefined;
      const target=new URL(key);
      for(const [candidate,response] of this.entries){
        const url=new URL(candidate);
        if(url.origin===target.origin&&url.pathname===target.pathname)return response.clone();
      }
      return undefined;
    }
    async keys(){return[...this.entries.keys()].map(url=>new ScopedRequest(url));}
    async delete(input){return this.entries.delete(keyFor(input));}
  }

  const caches={
    async open(name){if(!stores.has(name))stores.set(name,new MemoryCache());return stores.get(name);},
    async keys(){return[...stores.keys()];},
    async delete(name){return stores.delete(name);}
  };

  async function fetchImpl(input){
    const request=requestFor(input);
    const url=new URL(request.url);
    fetchLog.push(url.href);
    const supabase=url.hostname==='cdn.jsdelivr.net'||url.hostname==='unpkg.com';
    if(supabase){
      if(supabaseMode==='offline')throw new TypeError('Supabase network unavailable');
      if(supabaseMode==='error')return new NativeResponse('Supabase upstream error',{status:503});
      if(supabaseMode==='primary-stall'&&url.hostname==='cdn.jsdelivr.net')return await new Promise(()=>{});
      return new NativeResponse(`SUPABASE:${url.hostname}`,{status:200,headers:{'content-type':'application/javascript'}});
    }
    if(networkMode==='offline')throw new TypeError('Network unavailable');
    if(networkMode==='error')return new NativeResponse('Temporary upstream error',{status:503});
    return new NativeResponse(`NETWORK:${url.pathname}`,{status:200,headers:{'content-type':url.pathname.endsWith('.css')?'text/css':'application/javascript'}});
  }

  const self={
    registration:{scope,showNotification:async()=>{}},
    location:new URL(scope),
    clients:{claim:async()=>{},matchAll:async()=>[],openWindow:async()=>null},
    skipWaiting:async()=>{},
    addEventListener(type,handler){handlers.set(type,handler);}
  };

  vm.runInNewContext(source,{
    self,caches,fetch:fetchImpl,Request:ScopedRequest,Response:NativeResponse,URL,Set,Promise,String,Error,console,setTimeout,clearTimeout
  },{filename:'sw.js'});

  async function runLifecycle(type){
    let work=Promise.resolve();
    handlers.get(type)?.({waitUntil(value){work=Promise.resolve(value);}});
    await work;
  }

  async function request(url,{mode='cors',destination='script'}={}){
    let responsePromise=null;
    handlers.get('fetch')?.({
      request:{url:new URL(url,scope).href,method:'GET',mode,destination},
      respondWith(value){responsePromise=Promise.resolve(value);}
    });
    assert(responsePromise,`Service worker did not handle ${url}`);
    return await responsePromise;
  }

  return{
    caches,
    fetchLog,
    setNetworkMode(value){networkMode=value;},
    setSupabaseMode(value){supabaseMode=value;},
    runLifecycle,
    request
  };
}

const runtime=createRuntime();
await runtime.runLifecycle('install');
await runtime.runLifecycle('activate');

const cache=await runtime.caches.open('octagon-hq-static-v21');
for(const path of [
  'index.html',
  'assets/css/app.css',
  'assets/css/home-dashboard.css',
  'assets/css/native-app-shell.css',
  'assets/css/native-app-shell-stability.css',
  'assets/css/product-polish.css',
  'assets/js/fresh-home-route-bootstrap.js',
  'assets/js/octagon-hq-shell.js',
  'assets/data/ranking-data.js',
  'assets/data/display-overrides.js',
  'assets/js/app.js',
  'assets/data/play-data.js',
  'assets/data/picks-events.js',
  'assets/js/app-update-watcher.js',
  'assets/js/home-dashboard.js',
  'assets/js/fresh-home-launch.js',
  'assets/js/native-app-shell.js',
  'assets/js/native-app-shell-stability.js'
]){
  assert(await cache.match(new URL(path,scope).href),`Installed cache is missing ${path}`);
}
assert(await cache.match('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'),'The installed cache did not warm a real Supabase browser library.');

runtime.setSupabaseMode('primary-stall');
const alternate=await runtime.request('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',{mode:'no-cors'});
assert.equal(alternate.status,200,'A stalled primary Supabase CDN did not recover through the alternate CDN.');
assert.match(await alternate.text(),/SUPABASE:unpkg\.com/,'The alternate CDN did not win the bounded startup race.');

runtime.setSupabaseMode('offline');
const cachedSupabase=await runtime.request('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',{mode:'no-cors'});
assert.equal(cachedSupabase.status,200,'Both unavailable CDNs did not recover the installed real Supabase library.');
assert.match(await cachedSupabase.text(),/SUPABASE:/,'The installed Supabase response was replaced by a fake client.');

runtime.setNetworkMode('offline');
const shellScript=await runtime.request('assets/js/octagon-hq-shell.js?v=old-shell-key');
assert.equal(shellScript.status,200,'Offline relaunch could not recover the canonical shell script.');
assert.match(await shellScript.text(),/NETWORK:\/ufc-goat-rankings\/assets\/js\/octagon-hq-shell\.js/);

const homeStyles=await runtime.request('assets/css/home-dashboard.css?v=old-home-key',{destination:'style'});
assert.equal(homeStyles.status,200,'Offline relaunch could not recover the Home dashboard stylesheet.');
assert.match(await homeStyles.text(),/NETWORK:\/ufc-goat-rankings\/assets\/css\/home-dashboard\.css/);

const navigation=await runtime.request('?group=GOAT26#picks',{mode:'navigate',destination:'document'});
assert.equal(navigation.status,200,'Offline standalone navigation could not recover a cached app document.');
assert.match(await navigation.text(),/NETWORK:\/ufc-goat-rankings\/(?:index\.html)?/);

runtime.setNetworkMode('error');
const transientFailure=await runtime.request('assets/js/native-app-shell.js?v=temporary-503');
assert.equal(transientFailure.status,200,'A temporary non-OK network response bypassed the installed shell fallback.');
assert.match(await transientFailure.text(),/NETWORK:\/ufc-goat-rankings\/assets\/js\/native-app-shell\.js/);

const coldRuntime=createRuntime();
coldRuntime.setSupabaseMode('offline');
await coldRuntime.runLifecycle('install');
await coldRuntime.runLifecycle('activate');
const started=Date.now();
const failedSupabase=await coldRuntime.request('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',{mode:'no-cors'});
const elapsed=Date.now()-started;
assert.equal(failedSupabase.status,0,'No-cache Supabase failure should unblock the parser with a network error.');
assert(elapsed<500,`No-cache Supabase failure exceeded its startup deadline: ${elapsed}ms`);

assert.match(rawSource,/await Promise\.all\(CORE\.map\(/,'The service worker may activate without completing the required shell cache.');
assert.doesNotMatch(rawSource,/Promise\.allSettled\(CORE\.map\(/,'Critical shell precaching still tolerates a partially empty cache.');
assert.match(rawSource,/Promise\.any\(sources\.map\(source=>fetchWithDeadline\(source\)\)\)/,'Supabase startup does not race its real transport sources.');
assert.match(rawSource,/return installed\|\|Response\.error\(\)/,'Supabase startup can still hang instead of using cache or failing closed.');

console.log(JSON.stringify({
  passed:true,
  cache:'octagon-hq-static-v21',
  requiredShellCached:true,
  alternateSupabaseRecovered:true,
  installedRealSupabaseRecovered:true,
  noCacheSupabaseFailedWithinDeadline:true,
  offlineVersionedScriptRecovered:true,
  offlinePaletteRecovered:true,
  offlineNavigationRecovered:true,
  transientNetworkFailureRecovered:true
},null,2));