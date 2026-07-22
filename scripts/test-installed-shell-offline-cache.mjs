import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('sw.js','utf8');
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
  let networkMode='online';

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
    if(networkMode==='offline')throw new TypeError('Network unavailable');
    if(networkMode==='error')return new NativeResponse('Temporary upstream error',{status:503});
    const url=new URL(request.url);
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
    self,caches,fetch:fetchImpl,Request:ScopedRequest,Response:NativeResponse,URL,Set,Promise,String,console
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
    setNetworkMode(value){networkMode=value;},
    runLifecycle,
    request
  };
}

const runtime=createRuntime();
await runtime.runLifecycle('install');
await runtime.runLifecycle('activate');

const cache=await runtime.caches.open('octagon-hq-static-v20');
for(const path of [
  'index.html',
  'assets/css/app.css',
  'assets/css/home-dashboard.css',
  'assets/css/native-app-shell.css',
  'assets/css/native-app-shell-stability.css',
  'assets/css/product-polish.css',
  'assets/js/fresh-home-route-bootstrap.js',
  'assets/js/octagon-hq-shell.js',
  'assets/js/app-update-watcher.js',
  'assets/js/home-dashboard.js',
  'assets/js/fresh-home-launch.js',
  'assets/js/native-app-shell.js',
  'assets/js/native-app-shell-stability.js'
]){
  assert(await cache.match(new URL(path,scope).href),`Installed cache is missing ${path}`);
}

runtime.setNetworkMode('offline');
const shellScript=await runtime.request('assets/js/octagon-hq-shell.js?v=old-shell-key');
assert.equal(shellScript.status,200,'Offline relaunch could not recover the canonical shell script.');
assert.match(await shellScript.text(),/NETWORK:\/ufc-goat-rankings\/assets\/js\/octagon-hq-shell\.js/);

const homeStyles=await runtime.request('assets/css/home-dashboard.css?v=old-home-key',{destination:'style'});
assert.equal(homeStyles.status,200,'Offline relaunch could not recover the Home dashboard stylesheet.');
assert.match(await homeStyles.text(),/NETWORK:\/ufc-goat-rankings\/assets\/css\/home-dashboard\.css/);

const navigation=await runtime.request('?group=GOAT26#picks',{mode:'navigate',destination:'document'});
assert.equal(navigation.status,200,'Offline standalone navigation could not recover cached index.html.');
assert.match(await navigation.text(),/NETWORK:\/ufc-goat-rankings\/index\.html/);

runtime.setNetworkMode('error');
const transientFailure=await runtime.request('assets/js/native-app-shell.js?v=temporary-503');
assert.equal(transientFailure.status,200,'A temporary non-OK network response bypassed the installed shell fallback.');
assert.match(await transientFailure.text(),/NETWORK:\/ufc-goat-rankings\/assets\/js\/native-app-shell\.js/);

assert.match(source,/await Promise\.all\(CORE\.map\(/,'The service worker may activate without completing the required shell cache.');
assert.doesNotMatch(source,/Promise\.allSettled\(CORE\.map\(/,'Critical shell precaching still tolerates a partially empty cache.');

console.log(JSON.stringify({
  passed:true,
  cache:'octagon-hq-static-v20',
  requiredShellCached:true,
  offlineVersionedScriptRecovered:true,
  offlinePaletteRecovered:true,
  offlineNavigationRecovered:true,
  transientNetworkFailureRecovered:true
},null,2));