import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.cwd(), process.argv[2] || 'dist');
const origin = 'https://bitsresearch.github.io';
const routes = ['/', '/about/', '/people/', '/what-we-care/', '/research-update/', '/output-resources/', '/get-involved/', '/contact/', '/privacy-policy/', '/terms-of-use/', '/accessibility/', '/research-ethics/'];
const indexableNavigationRoutes = ['/about/', '/what-we-care/', '/people/', '/output-resources/', '/get-involved/', '/contact/'];
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

for (const route of routes) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html');
  const html = read(file);
  assert(Boolean(html), `Missing canonical page: ${route}`);
  assert(html.includes(`<link rel="canonical" href="${origin}${route}"`), `Incorrect canonical: ${route}`);
  assert(/<meta name="description" content="[^"]+"/.test(html), `Missing description: ${route}`);
  assert(/<h1[\s>]/i.test(html), `Missing static H1: ${route}`);
  assert(!html.includes('visibility: hidden'), `Static content hidden: ${route}`);
}

for (const route of indexableNavigationRoutes) {
  const file = path.join(dist, route.slice(1), 'index.html');
  const html = read(file);
  assert(/<meta\s+name=["']robots["']\s+content=["']index,\s*follow["']\s*\/?\s*>/i.test(html), `Page is not explicitly indexable: ${route}`);
  assert(!/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html), `Page contains noindex: ${route}`);
  assert(!fs.existsSync(path.join(dist, `${route.slice(1, -1)}.html`)), `Duplicate .html alias exists for indexable page: ${route}`);
}

for (const file of ['sitemap.xml','robots.txt','.nojekyll']) {
  assert(fs.existsSync(path.join(dist,file)) || fs.existsSync(path.join(dist,'public',file)), `Missing deployment file: ${file}`);
}
assert(fs.existsSync(path.join(dist,'images/og-image.jpg')) || fs.existsSync(path.join(dist,'public/images/og-image.jpg')), 'Missing deployment file: images/og-image.jpg');

const sitemap = read(path.join(dist,'sitemap.xml'));
for (const route of routes) assert(sitemap.includes(`<loc>${origin}${route}</loc>`), `Sitemap missing: ${route}`);
assert(!/upcomingworkshops|upcomingworkshop|team\//.test(sitemap), 'Sitemap contains retired route');
assert(!/<lastmod>|<priority>|<changefreq>/.test(sitemap), 'Sitemap contains unreliable optional metadata');

const robots = read(path.join(dist, 'robots.txt')) || read(path.join(dist, 'public', 'robots.txt'));
assert(/User-agent:\s*\*/i.test(robots) && /Allow:\s*\//i.test(robots), 'robots.txt must allow site crawling');
assert(!/^\s*Disallow:\s*\/(?:about|what-we-care|people|output-resources|get-involved|contact)\/?\s*$/im.test(robots), 'robots.txt blocks an indexable navigation page');

const redirectChecks = [
  ['upcomingworkshops/index.html','/#upcoming-workshops'], ['upcomingworkshops.html','/#upcoming-workshops'],
  ['upcomingworkshop/index.html','/#upcoming-workshops'], ['upcomingworkshop.html','/#upcoming-workshops'],
  ['team/index.html','/people/'], ['team.html','/people/']
];
for (const [file,target] of redirectChecks) {
  const html=read(path.join(dist,file));
  assert(html.includes('noindex, follow') && html.includes(target), `Invalid legacy redirect: ${file}`);
}

const jsFiles = [];
const walk = dir => { for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,entry.name); entry.isDirectory()?walk(p):jsFiles.push(p); } };
walk(dist);
const bundledJs = jsFiles.filter(f=>f.endsWith('.js')).map(read).join('\n');
const sourceApp = read(path.join(dist, 'App.tsx'));
const js = bundledJs || sourceApp;
for (const marker of ['2PACX-1vSHQGTMTLaBAyxMZYxyjG1JrhOtHwvzZmDCgJ_3jaBJnCg81qmtRuN3Mj4toSFcPgJQ113wI1qyi7cS','2PACX-1vSLAX_TguHx2FXd0pxNxM5ViTiTnGnbZPsdrO7KGm98aekIxu4kkHHhAVwM2_W1xiB_WJTbPfSZLet2','2PACX-1vTqnqjMFiQ3G6ehRg-Zh8GdjbbcpbeaEsp4CpgmHNcsdJR0-SgcrXkSDF8Hnypub4Jz4zII4zCL8-Ue']) {
  assert(js.includes(marker), `Protected Google CSV integration missing: ${marker.slice(0,24)}…`);
}

const notFoundHtml = read(path.join(dist, '404.html'));
assert(notFoundHtml.includes('<h1>Page Not Found</h1>'), '404.html must contain a static Page Not Found fallback');
assert(!/http-equiv=["']refresh["']/i.test(notFoundHtml), '404.html must not redirect automatically');
assert(!notFoundHtml.includes('src="./index.tsx"'), '404.html must use the production application bundle');
assert(notFoundHtml.includes('name="robots" content="noindex, follow"'), '404.html must remain noindex, follow');

if (failures.length) {
  console.error(`SEO validation failed (${failures.length}):`);
  failures.forEach(x=>console.error(`- ${x}`));
  process.exit(1);
}

console.log(`SEO validation passed for ${routes.length} canonical pages, legacy redirects, deployment files, and protected CSV integrations.`);
