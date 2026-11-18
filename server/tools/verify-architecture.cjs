/* Dependency-free structural regression: preserve independent apps, modular
 * route count, model count, valid imports, and an acyclic backend graph. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const frontend=path.resolve(root,'../frontend');
const backendPackage=require(path.join(root,'package.json'));
const frontendPackage=require(path.join(frontend,'package.json'));
assert(fs.existsSync(path.join(root,'app.js')) && fs.existsSync(path.join(root,'server.js')));
assert(!fs.existsSync(path.join(root,'src/api.js')),'Old all-in-one backend must not ship');
assert(!fs.existsSync(path.join(frontend,'app/api')),'Next.js must not contain server API routes');
assert(!fs.existsSync(path.join(frontend,'lib/server')),'Frontend must not import backend services');
assert(backendPackage.dependencies.mongodb && backendPackage.dependencies.express && !backendPackage.dependencies.next);
assert(frontendPackage.dependencies.next && !frontendPackage.dependencies.mongodb && !frontendPackage.dependencies.express);
const dirs=['config','controllers','middleware','models','routes','services','utils'];
const files=[path.join(root,'app.js'),path.join(root,'server.js')];
for(const dir of dirs)for(const name of fs.readdirSync(path.join(root,dir)))if(name.endsWith('.js'))files.push(path.join(root,dir,name));
const modelFiles=files.filter(name=>name.endsWith('Model.js'));
assert.equal(modelFiles.length,12,'A model/repository per existing Mongo collection');
const contractReport=JSON.parse(fs.readFileSync(path.join(root,'../docs/route-contract-report.json'),'utf8'));
const expectedRouteCount=contractReport.passed;
const graph=new Map(files.map(file=>[file,[]]));
let routeCount=0;
for(const file of files){
  const source=fs.readFileSync(file,'utf8');
  if(file===path.join(root,'app.js'))routeCount += [...source.matchAll(/\bapp\.(get|post|patch|put|delete)\s*\(['"]\/api\//g)].length;
  if(file.split(path.sep).includes('routes'))routeCount += [...source.matchAll(/\brouter\.(get|post|patch|put|delete)\s*\(/g)].length;
  for(const [,specifier] of source.matchAll(/(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"](\.[^'"]+)['"]/g)){
    const target=path.resolve(path.dirname(file),specifier);
    assert(fs.existsSync(target),`Missing import ${specifier} from ${path.relative(root,file)}`);
    if(graph.has(target))graph.get(file).push(target);
  }
}
assert.equal(routeCount,expectedRouteCount,'All pre-migration API method/path contracts must have routes');
const visited=new Set(),active=new Set();
function visit(file){
  assert(!active.has(file),`Circular import involving ${path.relative(root,file)}`);
  if(visited.has(file))return;
  active.add(file);
  for(const child of graph.get(file))visit(child);
  active.delete(file);visited.add(file);
}
for(const file of files)visit(file);
console.log(`PASS: ${modelFiles.length} existing collection models, ${routeCount} method/path routes, ${files.length} import-clean acyclic modules, and independent Next.js/Express packages.`);
