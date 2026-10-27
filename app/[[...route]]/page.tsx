import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
// One authored layout is shared by the fully tested static preview and Next.js.
// Client-side navigation preserves page transitions; all URLs are server-addressable.
export default async function Page({ params }: { params: Promise<{ route?: string[] }> }) {
  const {route = []} = await params;
  const validPages = !route.length || (route.length === 1 && ['work','about','contact'].includes(route[0]));
  const projectSlugs = new Set(['tummly','verendo','aura-attire','burger-house','nexora','meridian-dashboard','monarch-motors','atelier-no-9','the-good-table','pulse-finance','lumen-skincare','kinetic-type','urban-estate','stride-athletics','nomad-collective','forma-interiors','bloom-botanicals','noir-parfum','orbit-app','chromatic-futures']);
  if (!validPages && !(route.length === 2 && route[0] === 'work' && projectSlugs.has(route[1]))) notFound();
  const html = fs.readFileSync(path.join(process.cwd(), 'site', 'index.html'), 'utf8');
  const content = html.split('<!-- APP-START -->')[1]?.split('<!-- APP-END -->')[0] || '';
  return <div id="site-shell" dangerouslySetInnerHTML={{__html: content}} />;
}
