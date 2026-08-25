-- RENTOURA.LK — MIGRATION 011: JOBS L3 TAXONOMY EXPANSION
-- Synchronizes the Job module category taxonomy with 30 L1 roots, 60 L2 subcategory role groups, and 157 L3 specialization roles.
-- Repeat-safe & idempotent.

BEGIN;

CREATE TEMP TABLE temp_job_canonical_categories (
  module text NOT NULL DEFAULT 'job',
  level integer NOT NULL,
  name text NOT NULL,
  slug text NOT NULL,
  parent_slug text,
  sort_order integer NOT NULL DEFAULT 0,
  icon_key text,
  description text
) ON COMMIT DROP;

INSERT INTO temp_job_canonical_categories (level, name, slug, parent_slug, sort_order, icon_key, description)
VALUES
  -- 1. Office & Administration
  (1, 'Office & Administration', 'office-administration', NULL, 0, '📂', 'Office assistants, receptionists, data entry and secretarial roles'),
  (2, 'Clerical & Office Support', 'clerical-office-support', 'office-administration', 0, '📁', 'Clerical duties, data entry & front desk'),
  (3, 'Office Assistant', 'office-assistant', 'clerical-office-support', 0, '📎', 'General clerical & office help'),
  (3, 'Clerk', 'clerk', 'clerical-office-support', 1, '📁', 'Documentation & administrative filing'),
  (3, 'Receptionist', 'receptionist', 'clerical-office-support', 2, '🛎️', 'Front desk management & guest greeting'),
  (3, 'Data Entry Operator', 'data-entry-operator', 'clerical-office-support', 3, '⌨️', 'Typing, database entry & spreadsheet tasks'),
  (2, 'Executive & Secretarial Support', 'executive-secretarial-support', 'office-administration', 1, '📋', 'Executive assistants, PA & document control'),
  (3, 'Secretary', 'secretary', 'executive-secretarial-support', 0, '📝', 'Executive assistance & appointment scheduling'),
  (3, 'Administrative Assistant', 'administrative-assistant', 'executive-secretarial-support', 1, '📋', 'Operations support & office coordination'),
  (3, 'Personal Assistant (PA)', 'personal-assistant', 'executive-secretarial-support', 2, '💼', 'Executive & direct director support'),
  (3, 'Document Controller', 'document-controller', 'executive-secretarial-support', 3, '📑', 'Archiving & project document management'),
  (3, 'Front Office Executive', 'front-office-executive', 'executive-secretarial-support', 4, '🏢', 'Customer greeting & desk administration'),

  -- 2. IT & Technology
  (1, 'IT & Technology', 'it-technology', NULL, 1, '💻', 'Software engineers, web developers, mobile apps, QA & tech support'),
  (2, 'Software Development', 'software-development', 'it-technology', 0, '💻', 'Frontend, backend, full stack, mobile & web engineering'),
  (3, 'Software Developer', 'software-developer', 'software-development', 0, '💻', 'Backend, systems & application programming'),
  (3, 'Frontend Developer', 'frontend-developer', 'software-development', 1, '🎨', 'React, Vue, Angular UI development'),
  (3, 'Backend Developer', 'backend-developer', 'software-development', 2, '⚙️', 'Node.js, Python, Java, Go, APIs & databases'),
  (3, 'Full Stack Developer', 'full-stack-developer', 'software-development', 3, '🚀', 'End-to-end full stack web architecture'),
  (3, 'Mobile App Developer', 'mobile-app-developer', 'software-development', 4, '📱', 'iOS (Swift), Android (Kotlin), Flutter, React Native'),
  (3, 'Web Developer', 'web-developer', 'software-development', 5, '🌐', 'Website & web app development'),
  (3, 'QA Engineer', 'qa-engineer', 'software-development', 6, '🐞', 'Manual & automated quality assurance testing'),
  (3, 'DevOps / Cloud Engineer', 'devops-cloud-engineer', 'software-development', 7, '☁️', 'AWS, GCP, Docker, Kubernetes & CI/CD'),
  (2, 'Data, AI & Infrastructure', 'data-ai-infrastructure', 'it-technology', 1, '📊', 'Data analytics, cyber security, networking & UI/UX'),
  (3, 'Data Analyst / Scientist', 'data-analyst-scientist', 'data-ai-infrastructure', 0, '📊', 'SQL, Python, PowerBI & machine learning'),
  (3, 'Network Engineer', 'network-engineer', 'data-ai-infrastructure', 1, '📡', 'Cisco, routing, switches & firewall security'),
  (3, 'Cyber Security Specialist', 'cyber-security-specialist', 'data-ai-infrastructure', 2, '🛡️', 'Penetration testing & vulnerability assessment'),
  (3, 'IT Support & Helpdesk', 'it-support-helpdesk', 'data-ai-infrastructure', 3, '🛠️', 'Hardware troubleshooting, OS & network setup'),
  (3, 'UI/UX Designer', 'ui-ux-designer', 'data-ai-infrastructure', 4, '✨', 'Figma wireframing & user experience design'),

  -- 3. Sales & Marketing
  (1, 'Sales & Marketing', 'sales-marketing', NULL, 2, '📈', 'Sales executives, digital marketing, SEO, social media & brand management'),
  (2, 'Direct & Field Sales', 'direct-field-sales', 'sales-marketing', 0, '🤝', 'B2B/B2C sales reps, telemarketing & outdoor sales'),
  (3, 'Sales Executive', 'sales-executive', 'direct-field-sales', 0, '💼', 'B2B/B2C direct product & service sales'),
  (3, 'Sales Representative', 'sales-representative', 'direct-field-sales', 1, '🤝', 'Field sales, store representation & outreach'),
  (3, 'Telemarketing / Cold Caller', 'telemarketing-cold-caller', 'direct-field-sales', 2, '📞', 'Phone sales & inbound/outbound leads'),
  (2, 'Digital & Brand Marketing', 'digital-brand-marketing', 'sales-marketing', 1, '📢', 'Social media, SEO, performance marketing & content'),
  (3, 'Marketing Executive', 'marketing-executive', 'digital-brand-marketing', 0, '📢', 'Campaign execution & promotional drives'),
  (3, 'Digital Marketing Executive', 'digital-marketing-executive', 'digital-brand-marketing', 1, '📱', 'PPC, performance ads & campaign manager'),
  (3, 'Social Media Manager', 'social-media-manager', 'digital-brand-marketing', 2, '💬', 'Instagram, TikTok, Facebook content & community'),
  (3, 'SEO Specialist', 'seo-specialist', 'digital-brand-marketing', 3, '🔍', 'Organic ranking, keywords & content audit'),
  (3, 'Content Creator', 'content-creator', 'digital-brand-marketing', 4, '🎬', 'Video reels, copywriting & digital media'),
  (3, 'Brand Executive', 'brand-executive', 'digital-brand-marketing', 5, '🌟', 'Brand strategy, PR & event activations'),

  -- 4. Accounting & Finance
  (1, 'Accounting & Finance', 'accounting-finance', NULL, 3, '📊', 'Accountants, auditors, bookkeepers, payroll and finance managers'),
  (2, 'Accounting & Auditing', 'accounting-auditing', 'accounting-finance', 0, '📊', 'Financial statements, ledgers, audit & bookkeeping'),
  (3, 'Accountant', 'accountant', 'accounting-auditing', 0, '📊', 'Full financial accounts & tax compliance'),
  (3, 'Accounts Assistant', 'accounts-assistant', 'accounting-auditing', 1, '🧾', 'Ledger entry, invoicing & bank reconciliation'),
  (3, 'Auditor', 'auditor', 'accounting-auditing', 2, '🔍', 'Internal & external compliance auditing'),
  (3, 'Bookkeeper', 'bookkeeper', 'accounting-auditing', 3, '📒', 'QuickBooks, Xero & day-to-day accounts'),
  (2, 'Finance, Tax & Payroll', 'finance-tax-payroll', 'accounting-finance', 1, '💼', 'Financial management, RAMIS tax filings & salary processing'),
  (3, 'Finance Manager / Executive', 'finance-manager-executive', 'finance-tax-payroll', 0, '💼', 'Financial planning & cost budgeting'),
  (3, 'Payroll Officer', 'payroll-officer', 'finance-tax-payroll', 1, '💳', 'EPF/ETF salary processing & disbursements'),
  (3, 'Tax Assistant', 'tax-assistant', 'finance-tax-payroll', 2, '📑', 'RAMIS VAT, SSCL & corporate tax filings'),
  (3, 'Cashier', 'cashier', 'finance-tax-payroll', 3, '💵', 'Point of sale, billing & cash handling'),

  -- 8. Driving & Transport
  (1, 'Driving & Transport', 'driving-transport', NULL, 7, '🚗', 'Car drivers, van drivers, lorry drivers, couriers and forklift operators'),
  (2, 'Driver', 'driver', 'driving-transport', 0, '🚗', 'Personal chauffeurs, van, bus & heavy vehicle drivers'),
  (3, 'Car Driver', 'car-driver', 'driver', 0, '🚗', 'Personal, corporate & VIP chauffeurs'),
  (3, 'Van Driver', 'van-driver', 'driver', 1, '🚐', 'School van, office transport & tour van'),
  (3, 'Bus Driver', 'bus-driver', 'driver', 2, '🚌', 'Route bus & luxury coach drivers'),
  (3, 'Heavy Vehicle / Lorry Driver', 'heavy-vehicle-lorry-driver', 'driver', 3, '🚛', 'Heavy vehicle & light goods lorry drivers'),
  (3, 'Three Wheeler Driver', 'three-wheeler-driver', 'driver', 4, '🛺', 'Tuk-tuk hire & local transport'),
  (2, 'Couriers & Equipment Operators', 'couriers-equipment-operators', 'driving-transport', 1, '🛵', 'Delivery riders, dispatch couriers & forklift drivers'),
  (3, 'Courier / Delivery Rider', 'courier-delivery-rider', 'couriers-equipment-operators', 0, '🛵', 'Food delivery & express package courier'),
  (3, 'Forklift Operator', 'forklift-operator', 'couriers-equipment-operators', 1, '🚜', 'Warehouse container loading & pallet handling'),

  -- 15. Education
  (1, 'Education', 'education-job', NULL, 14, '📚', 'School teachers, preschool teachers, lecturers, private tutors and trainers'),
  (2, 'Teaching & Academic Staff', 'teaching-academic-staff', 'education-job', 0, '👩‍🏫', 'School teachers, preschool, university lecturers & tutors'),
  (3, 'Preschool Teacher', 'preschool-teacher', 'teaching-academic-staff', 0, '🧸', 'Early childhood education & Montessori'),
  (3, 'School Teacher', 'school-teacher', 'teaching-academic-staff', 1, '👩‍🏫', 'Primary & secondary school educators'),
  (3, 'Lecturer', 'lecturer', 'teaching-academic-staff', 2, '🎓', 'University & higher education institutes'),
  (3, 'Private Tutor', 'private-tutor', 'teaching-academic-staff', 3, '📝', 'O/L, A/L and syllabus home tuition'),
  (2, 'Language & Tech Instructors', 'language-tech-instructors', 'education-job', 1, '🗣️', 'English, spoken IELTS & computer science teachers'),
  (3, 'English Teacher', 'english-teacher', 'language-tech-instructors', 0, '🗣️', 'Spoken English, IELTS & grammar'),
  (3, 'ICT / Computer Teacher', 'ict-computer-teacher', 'language-tech-instructors', 1, '💻', 'Programming & computer literacy'),
  (3, 'Science & Maths Teacher', 'science-maths-teacher', 'language-tech-instructors', 2, '📐', 'Mathematics, Physics & Chemistry');

-- Upsert L1
INSERT INTO public.categories (module, level, name, slug, parent_id, sort_order, icon_key, description, status)
SELECT t.module, t.level, t.name, t.slug, NULL, t.sort_order, t.icon_key, t.description, 'active'
FROM temp_job_canonical_categories t
WHERE t.level = 1
ON CONFLICT (module, slug) DO UPDATE
SET name = EXCLUDED.name,
    level = EXCLUDED.level,
    sort_order = EXCLUDED.sort_order,
    icon_key = EXCLUDED.icon_key,
    description = EXCLUDED.description,
    status = 'active',
    updated_at = now();

-- Upsert L2
INSERT INTO public.categories (module, level, name, slug, parent_id, sort_order, icon_key, description, status)
SELECT t.module, t.level, t.name, t.slug, p.id, t.sort_order, t.icon_key, t.description, 'active'
FROM temp_job_canonical_categories t
JOIN public.categories p ON p.module = 'job' AND p.slug = t.parent_slug AND p.level = 1
WHERE t.level = 2
ON CONFLICT (module, slug) DO UPDATE
SET name = EXCLUDED.name,
    level = EXCLUDED.level,
    parent_id = EXCLUDED.parent_id,
    sort_order = EXCLUDED.sort_order,
    icon_key = EXCLUDED.icon_key,
    description = EXCLUDED.description,
    status = 'active',
    updated_at = now();

-- Upsert L3
INSERT INTO public.categories (module, level, name, slug, parent_id, sort_order, icon_key, description, status)
SELECT t.module, t.level, t.name, t.slug, p.id, t.sort_order, t.icon_key, t.description, 'active'
FROM temp_job_canonical_categories t
JOIN public.categories p ON p.module = 'job' AND p.slug = t.parent_slug AND p.level = 2
WHERE t.level = 3
ON CONFLICT (module, slug) DO UPDATE
SET name = EXCLUDED.name,
    level = EXCLUDED.level,
    parent_id = EXCLUDED.parent_id,
    sort_order = EXCLUDED.sort_order,
    icon_key = EXCLUDED.icon_key,
    description = EXCLUDED.description,
    status = 'active',
    updated_at = now();

COMMIT;
