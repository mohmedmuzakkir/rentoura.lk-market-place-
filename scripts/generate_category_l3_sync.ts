import { writeFileSync } from 'node:fs';
import { RENTALS_CATEGORIES } from '../src/data/categories/rentalsData';
import { JOBS_CATEGORIES } from '../src/data/categories/jobsData';
import { SERVICES_CATEGORIES } from '../src/data/categories/servicesData';

const slugify = (text: string) => text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
const quote = (value?: string | null) => value == null ? 'null' : `'${value.replace(/'/g, "''")}'`;
const sources = [['rental', RENTALS_CATEGORIES], ['job', JOBS_CATEGORIES], ['service', SERVICES_CATEGORIES]] as const;
const mains: string[] = [], subs: string[] = [], thirds: string[] = [];

for (const [module, categories] of sources) for (const [mi, main] of categories.entries()) {
  const mainSlug = main.slug || slugify(main.name);
  mains.push(`(${quote(module)},${quote(main.name)},${quote(mainSlug)},${mi},${quote(main.icon)},${quote(main.description)})`);
  for (const [si, sub] of main.subcategories.entries()) {
    const subSlug = sub.slug || slugify(sub.name);
    subs.push(`(${quote(module)},${quote(mainSlug)},${quote(sub.name)},${quote(subSlug)},${si},${quote(sub.icon)},${quote(sub.subtitle)})`);
    for (const [ti, third] of (sub.thirdLevelOptions || []).entries())
      thirds.push(`(${quote(module)},${quote(subSlug)},${quote(third.name)},${quote(third.slug || slugify(third.name))},${ti},${quote(third.icon)},${quote(third.subtitle)})`);
  }
}

const sql = `-- Generated from approved RENTOURA.LK taxonomy source data.\ncreate temp table category_main_sync(module text,name text,slug text,sort_order int,icon_key text,description text) on commit drop;\ncreate temp table category_sub_sync(module text,parent_slug text,name text,slug text,sort_order int,icon_key text,description text) on commit drop;\ncreate temp table category_l3_sync(module text,parent_slug text,name text,slug text,sort_order int,icon_key text,description text) on commit drop;\ninsert into category_main_sync values\n${mains.join(',\n')};\ninsert into category_sub_sync values\n${subs.join(',\n')};\ninsert into category_l3_sync values\n${thirds.join(',\n')};\n\ninsert into public.categories(module,name,slug,parent_id,level,status,sort_order,icon_key,description) select module,name,slug,null,1,'active',sort_order,icon_key,description from category_main_sync on conflict(module,slug) where parent_id is null do update set name=excluded.name,status='active',sort_order=excluded.sort_order,icon_key=excluded.icon_key,description=excluded.description,updated_at=now();\ninsert into public.categories(module,name,slug,parent_id,level,status,sort_order,icon_key,description) select s.module,s.name,s.slug,p.id,2,'active',s.sort_order,s.icon_key,s.description from category_sub_sync s join public.categories p on p.module=s.module and p.level=1 and p.slug=s.parent_slug on conflict(module,slug,parent_id) where parent_id is not null do update set name=excluded.name,status='active',sort_order=excluded.sort_order,icon_key=excluded.icon_key,description=excluded.description,updated_at=now();\ninsert into public.categories(module,name,slug,parent_id,level,status,sort_order,icon_key,description) select s.module,s.name,s.slug,p.id,3,'active',s.sort_order,s.icon_key,s.description from category_l3_sync s join public.categories p on p.module=s.module and p.level=2 and p.slug=s.parent_slug on conflict(module,slug,parent_id) where parent_id is not null do update set name=excluded.name,status='active',sort_order=excluded.sort_order,icon_key=excluded.icon_key,description=excluded.description,updated_at=now();\n\ndo $$ declare missing int; begin select count(*) into missing from category_l3_sync s where not exists(select 1 from public.categories p where p.module=s.module and p.level=2 and p.slug=s.parent_slug); if missing>0 then raise exception 'L3 sync has % missing parent categories',missing; end if; end $$;\n`;
writeFileSync(new URL('../supabase/migrations/20260826170000_complete_canonical_l3_taxonomy.sql', import.meta.url), sql);
console.log(`Generated ${mains.length} L1, ${subs.length} L2, ${thirds.length} L3 rows.`);
