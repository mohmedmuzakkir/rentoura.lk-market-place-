import { CategoryFormSchema } from '../../types/postFormTypes';

/**
 * 1. IT & TECHNOLOGY JOB SCHEMA
 */
export const JOB_IT_TECH_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'it-tech',
  categoryName: 'IT & Technology',
  title: 'Tech Stack & Requirements',
  description: 'Specify technologies, frameworks, and skills needed for this tech role',
  fields: [
    {
      id: 'primarySkills',
      label: 'Primary Tech Stack / Languages',
      type: 'text',
      required: true,
      placeholder: 'e.g. React, Node.js, Python, TypeScript, Java, Flutter, AWS',
      helpText: 'Enter main languages, frameworks, or databases separated by commas',
      gridCols: 1
    },
    {
      id: 'frameworks',
      label: 'Frameworks & Libraries',
      type: 'text',
      required: false,
      placeholder: 'e.g. Next.js, Express, Spring Boot, Django, Tailwind, Docker',
      gridCols: 2
    },
    {
      id: 'devLevel',
      label: 'Technical Role Seniority',
      type: 'select',
      required: true,
      options: [
        { id: 'intern', label: 'Trainee / Intern' },
        { id: 'junior', label: 'Junior Developer (0-2 Yrs)' },
        { id: 'mid', label: 'Mid-Level Engineer (2-5 Yrs)' },
        { id: 'senior', label: 'Senior Engineer (5+ Yrs)' },
        { id: 'lead', label: 'Tech Lead / Architect' }
      ],
      gridCols: 2
    },
    {
      id: 'portfolioRequired',
      label: 'GitHub / Portfolio Link Requested?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      helpText: 'Ask candidates to provide GitHub, GitLab, or Behance link in application',
      gridCols: 1
    }
  ]
};

/**
 * 2. OFFICE & ADMINISTRATION JOB SCHEMA
 */
export const JOB_OFFICE_ADMIN_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'office-admin',
  categoryName: 'Office & Administration',
  title: 'Office Skills & Computer Literacy',
  description: 'Specify administrative skills and software literacy required',
  fields: [
    {
      id: 'msOfficeSkills',
      label: 'MS Office & Software Literacy',
      type: 'select',
      required: true,
      options: [
        { id: 'basic', label: 'Basic (Word & Email)' },
        { id: 'intermediate', label: 'Intermediate (Excel, Word, PowerPoint)' },
        { id: 'advanced', label: 'Advanced (Pivot Tables, VLOOKUP, Macros)' },
        { id: 'expert', label: 'Expert / Systems Admin' }
      ],
      gridCols: 2
    },
    {
      id: 'typingSpeed',
      label: 'Typing & Data Entry Speed',
      type: 'select',
      required: false,
      options: [
        { id: 'standard', label: 'Standard Speed' },
        { id: 'fast', label: 'Fast (35-50 WPM)' },
        { id: 'very-fast', label: 'Very Fast (50+ WPM)' }
      ],
      gridCols: 2
    },
    {
      id: 'languagesRequired',
      label: 'Primary Working Languages',
      type: 'text',
      required: true,
      placeholder: 'e.g. Sinhala & English (Tamil is an advantage)',
      gridCols: 1
    }
  ]
};

/**
 * 3. SALES & MARKETING JOB SCHEMA
 */
export const JOB_SALES_MARKETING_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'sales-marketing',
  categoryName: 'Sales & Marketing',
  title: 'Sales Scope & Targets',
  description: 'Define sales environment, targets, and field requirements',
  fields: [
    {
      id: 'salesType',
      label: 'Sales Environment',
      type: 'select',
      required: true,
      options: [
        { id: 'indoor', label: 'Indoor / Retail Showroom Sales' },
        { id: 'field', label: 'Field / Outdoor Direct Sales' },
        { id: 'b2b', label: 'B2B Corporate Account Sales' },
        { id: 'digital', label: 'Digital Marketing & E-commerce Sales' },
        { id: 'telemarketing', label: 'Telemarketing / Call Center Sales' }
      ],
      gridCols: 2
    },
    {
      id: 'commissionBased',
      label: 'Commission Structure Available?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      helpText: 'Offers sales target incentives or per-sale commission on top of base pay',
      gridCols: 2
    },
    {
      id: 'ownVehicleRequired',
      label: 'Own Vehicle Required for Field Work?',
      type: 'select',
      required: true,
      options: [
        { id: 'no', label: 'No - Company Provided or Indoor Role' },
        { id: 'motorbike', label: 'Yes - Motorbike Required (Fuel Paid)' },
        { id: 'car-van', label: 'Yes - Car/Van Required (Fuel Paid)' }
      ],
      gridCols: 1
    }
  ]
};

/**
 * 4. ACCOUNTING & FINANCE JOB SCHEMA
 */
export const JOB_ACCOUNTING_FINANCE_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'accounting-finance',
  categoryName: 'Accounting & Finance',
  title: 'Accounting Software & Qualifications',
  description: 'Specify required financial software and professional memberships',
  fields: [
    {
      id: 'accountingSoftware',
      label: 'Accounting Software Knowledge',
      type: 'text',
      required: true,
      placeholder: 'e.g. QuickBooks, Xero, RAMIS, Tally, SAP, Excel',
      gridCols: 1
    },
    {
      id: 'profQualification',
      label: 'Professional Accounting Qualification',
      type: 'select',
      required: false,
      options: [
        { id: 'none', label: 'Not Mandatory / Student Level' },
        { id: 'aat', label: 'AAT Completed / Final Level' },
        { id: 'ca-part', label: 'CA Sri Lanka (Partly Qualified)' },
        { id: 'cima-part', label: 'CIMA / ACCA (Partly Qualified)' },
        { id: 'ca-full', label: 'CA Sri Lanka / CIMA / ACCA (Fully Qualified)' },
        { id: 'cma', label: 'CMA Sri Lanka Qualified' }
      ],
      gridCols: 2
    },
    {
      id: 'taxEpfKnowledge',
      label: 'RAMIS Tax & EPF/ETF Processing Experience?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      gridCols: 2
    }
  ]
};

/**
 * 5. DRIVING & TRANSPORT JOB SCHEMA
 */
export const JOB_DRIVING_TRANSPORT_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'driving-transport',
  categoryName: 'Driving & Transport',
  title: 'Driving License & Route Details',
  description: 'Specify license classes, vehicle types, and route expectations',
  fields: [
    {
      id: 'licenseClass',
      label: 'Driving License Class Required *',
      type: 'select',
      required: true,
      options: [
        { id: 'light-vehicle', label: 'Light Vehicle (Car / Dual Purpose / Van)' },
        { id: 'heavy-lorry', label: 'Heavy Vehicle / Lorry (Heavy Driving License)' },
        { id: 'three-wheeler', label: 'Three-Wheeler (Tuk Tuk)' },
        { id: 'motorbike', label: 'Motorcycle / Scooter' },
        { id: 'bus', label: 'Passenger Bus License' },
        { id: 'forklift', label: 'Forklift / Heavy Machinery License' }
      ],
      gridCols: 2
    },
    {
      id: 'vehicleProvided',
      label: 'Vehicle Provided by Employer?',
      type: 'radio',
      required: true,
      options: [
        { id: 'yes', label: 'Yes - Company Vehicle Provided' },
        { id: 'no-own-vehicle', label: 'No - Driver Must Bring Own Vehicle' }
      ],
      defaultValue: 'yes',
      gridCols: 2
    },
    {
      id: 'routeScope',
      label: 'Route & Working Area',
      type: 'select',
      required: true,
      options: [
        { id: 'local-city', label: 'Local City / District Only' },
        { id: 'islandwide', label: 'Islandwide Outstation Travel' },
        { id: 'fixed-route', label: 'Fixed Daily Route (Office / Transport)' },
        { id: 'port-airport', label: 'Port / Airport / Transfer Trips' }
      ],
      gridCols: 1
    }
  ]
};

/**
 * 6. HOSPITALITY & CHEF JOB SCHEMA
 */
export const JOB_HOSPITALITY_FOOD_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'hospitality-tourism',
  categoryName: 'Hospitality & Culinary',
  title: 'Culinary & Service Specifications',
  description: 'Detail cuisine expertise, shift arrangements, and amenities',
  fields: [
    {
      id: 'cuisineSpecialty',
      label: 'Cuisine / Specialization (if applicable)',
      type: 'text',
      required: false,
      placeholder: 'e.g. Sri Lankan Rice & Curry, Chinese, Italian, Western, Pastry, Kottu',
      gridCols: 1
    },
    {
      id: 'foodHygieneCert',
      label: 'Food Hygiene / SLTDA Certification Required?',
      type: 'toggle',
      required: false,
      defaultValue: false,
      gridCols: 2
    },
    {
      id: 'accommodationProvided',
      label: 'Free Accommodation Provided?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      gridCols: 2
    }
  ]
};

/**
 * 7. CONSTRUCTION & TRADES JOB SCHEMA
 */
export const JOB_CONSTRUCTION_TRADES_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'construction-trades',
  categoryName: 'Construction & Trades',
  title: 'Trade Expertise & Site Details',
  description: 'Specify trade craft, NVQ level, and site arrangements',
  fields: [
    {
      id: 'tradeType',
      label: 'Trade Craft / Skill Type *',
      type: 'select',
      required: true,
      options: [
        { id: 'mason', label: 'Mason / Tile Layer' },
        { id: 'carpenter', label: 'Carpenter / Woodworker' },
        { id: 'electrician', label: 'Building Electrician' },
        { id: 'plumber', label: 'Plumber / Pipe Fitter' },
        { id: 'welder', label: 'Welder / Fabricator' },
        { id: 'painter', label: 'Painter / Finisher' },
        { id: 'ac-tech', label: 'HVAC / AC Technician' },
        { id: 'heavy-op', label: 'JCB / Excavator Operator' }
      ],
      gridCols: 2
    },
    {
      id: 'nvqLevel',
      label: 'NVQ / Technical Certification Level',
      type: 'select',
      required: false,
      options: [
        { id: 'none', label: 'Practical Experience Only (No NVQ Needed)' },
        { id: 'nvq3', label: 'NVQ Level 3' },
        { id: 'nvq4', label: 'NVQ Level 4 / Diploma' },
        { id: 'nvq5+', label: 'NVQ Level 5 / Higher Diploma' }
      ],
      gridCols: 2
    },
    {
      id: 'toolsProvided',
      label: 'Power Tools Provided by Site?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      gridCols: 1
    }
  ]
};

/**
 * 8. HEALTHCARE & MEDICAL JOB SCHEMA
 */
export const JOB_HEALTHCARE_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'healthcare',
  categoryName: 'Healthcare & Medical Support',
  title: 'Medical Qualifications & Care Scope',
  description: 'Specify healthcare certifications and shift requirements',
  fields: [
    {
      id: 'medicalCert',
      label: 'SLMC Registration / Nursing Diploma',
      type: 'select',
      required: true,
      options: [
        { id: 'slmc-registered', label: 'SLMC Registered Nurse / Practitioner' },
        { id: 'nursing-diploma', label: 'Diploma in Nursing / Caregiving' },
        { id: 'first-aid', label: 'First Aid & Basic Caregiver Training' },
        { id: 'trainee', label: 'Trainee / Helper (On-Job Training)' }
      ],
      gridCols: 1
    },
    {
      id: 'facilityType',
      label: 'Work Facility Environment',
      type: 'select',
      required: false,
      options: [
        { id: 'hospital', label: 'Private / Base Hospital' },
        { id: 'clinic', label: 'Medical Clinic / Pharmacy' },
        { id: 'home-care', label: 'In-Home Patient / Elderly Care' },
        { id: 'lab', label: 'Diagnostic Laboratory' }
      ],
      gridCols: 1
    }
  ]
};

/**
 * 9. EDUCATION & TEACHING JOB SCHEMA
 */
export const JOB_EDUCATION_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'education',
  categoryName: 'Education & Teaching',
  title: 'Subject & Medium Details',
  description: 'Specify subject area, student grade level, and medium',
  fields: [
    {
      id: 'subjectArea',
      label: 'Subject / Discipline Taught',
      type: 'text',
      required: true,
      placeholder: 'e.g. Mathematics, English, Science, ICT, Accounting, Physics',
      gridCols: 1
    },
    {
      id: 'instructionMedium',
      label: 'Medium of Instruction',
      type: 'select',
      required: true,
      options: [
        { id: 'english', label: 'English Medium' },
        { id: 'sinhala', label: 'Sinhala Medium' },
        { id: 'tamil', label: 'Tamil Medium' },
        { id: 'bilingual', label: 'Bilingual (English + Sinhala/Tamil)' }
      ],
      gridCols: 2
    },
    {
      id: 'studentLevel',
      label: 'Target Student Level',
      type: 'select',
      required: true,
      options: [
        { id: 'primary', label: 'Primary School (Grade 1-5)' },
        { id: 'secondary', label: 'Secondary School (Grade 6-11 / O/L)' },
        { id: 'advanced', label: 'Advanced Level (A/L Science/Maths/Commerce)' },
        { id: 'higher-ed', label: 'University / Diploma Level' },
        { id: 'adult-vocational', label: 'Adult Spoken Language / Vocational' }
      ],
      gridCols: 2
    }
  ]
};

/**
 * 10. BEAUTY & FASHION JOB SCHEMA
 */
export const JOB_BEAUTY_FASHION_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'beauty-fashion',
  categoryName: 'Beauty & Fashion',
  title: 'Styling & Beauty Specialization',
  description: 'Specify salon specialization and client portfolio needs',
  fields: [
    {
      id: 'beautySpecialty',
      label: 'Specialization Skill',
      type: 'text',
      required: true,
      placeholder: 'e.g. Hair Cutting & Coloring, Bridal Dressing, Nail Art, Barbering, Tailoring',
      gridCols: 1
    },
    {
      id: 'photosRequired',
      label: 'Photo Portfolio Required with Application?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      gridCols: 1
    }
  ]
};

/**
 * 11. SECURITY & SAFETY JOB SCHEMA
 */
export const JOB_SECURITY_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'security',
  categoryName: 'Security & Safety',
  title: 'Security Clearance & Physical Criteria',
  description: 'Detail security experience, ex-service preferences, and site type',
  fields: [
    {
      id: 'exServicePreference',
      label: 'Ex-Military / Police Experience Preferred?',
      type: 'select',
      required: false,
      options: [
        { id: 'no-preference', label: 'No Preference / Open to Civilian Guards' },
        { id: 'ex-military-preferred', label: 'Ex-Army / Navy / Air Force Preferred' },
        { id: 'ex-police-preferred', label: 'Ex-Police / Special Task Force Preferred' }
      ],
      gridCols: 1
    },
    {
      id: 'uniformAccommodationProvided',
      label: 'Uniform & On-Site Lodging Provided?',
      type: 'toggle',
      required: false,
      defaultValue: true,
      gridCols: 1
    }
  ]
};

/**
 * 12. FREELANCE / REMOTE JOB SCHEMA
 */
export const JOB_FREELANCE_REMOTE_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'freelance-remote',
  categoryName: 'Freelance & Remote Work',
  title: 'Project Deliverables & Work Model',
  description: 'Specify remote collaboration tools, contract duration, and hours',
  fields: [
    {
      id: 'projectType',
      label: 'Contract Nature',
      type: 'select',
      required: true,
      options: [
        { id: 'fixed-project', label: 'Fixed Scope Project (Milestone Based)' },
        { id: 'hourly-retainer', label: 'Ongoing Monthly Retainer' },
        { id: 'task-based', label: 'Per-Task / Per-Deliverable' }
      ],
      gridCols: 2
    },
    {
      id: 'remoteTools',
      label: 'Required Remote Tools',
      type: 'text',
      required: false,
      placeholder: 'e.g. Slack, Zoom, Trello, Jira, Google Workspace, Figma',
      gridCols: 2
    }
  ]
};

/**
 * 13. GENERAL FALLBACK JOB SCHEMA
 */
export const JOB_GENERIC_FALLBACK_SCHEMA: CategoryFormSchema = {
  module: 'jobs',
  categoryId: 'general-job',
  categoryName: 'Job Opportunity',
  title: 'Role Specifications & Key Duties',
  description: 'Specify core duties and expectations for this role',
  fields: [
    {
      id: 'coreDuties',
      label: 'Core Responsibilities & Expectations',
      type: 'textarea',
      required: true,
      placeholder: 'List key daily tasks, responsibilities, and expected outcomes for candidates...',
      gridCols: 1
    },
    {
      id: 'specialSkills',
      label: 'Special Skills or Soft Skills Required',
      type: 'text',
      required: false,
      placeholder: 'e.g. Strong communication, teamwork, time management, problem solving',
      gridCols: 1
    }
  ]
};

/**
 * Helper resolver for Job schemas
 */
export function getJobCategoryFormSchema(
  categoryId?: string,
  subcategoryId?: string,
  categoryName?: string,
  subcategoryName?: string
): CategoryFormSchema {
  const catKey = (categoryId || '').toLowerCase();
  const subKey = (subcategoryId || '').toLowerCase();
  const catName = (categoryName || '').toLowerCase();
  const subName = (subcategoryName || '').toLowerCase();

  if (catKey.includes('it') || catKey.includes('tech') || subKey.includes('dev') || catName.includes('it') || catName.includes('technology')) {
    return JOB_IT_TECH_SCHEMA;
  }

  if (catKey.includes('office') || catKey.includes('admin') || subKey.includes('clerk') || subKey.includes('reception') || catName.includes('office') || catName.includes('admin')) {
    return JOB_OFFICE_ADMIN_SCHEMA;
  }

  if (catKey.includes('sales') || catKey.includes('market') || subKey.includes('sales') || catName.includes('sales')) {
    return JOB_SALES_MARKETING_SCHEMA;
  }

  if (catKey.includes('account') || catKey.includes('finance') || subKey.includes('account') || catName.includes('accounting')) {
    return JOB_ACCOUNTING_FINANCE_SCHEMA;
  }

  if (catKey.includes('driv') || catKey.includes('transport') || subKey.includes('driver') || subKey.includes('courier') || catName.includes('driving')) {
    return JOB_DRIVING_TRANSPORT_SCHEMA;
  }

  if (catKey.includes('hospit') || catKey.includes('hotel') || catKey.includes('food') || catKey.includes('tour') || subKey.includes('chef') || subKey.includes('waiter') || catName.includes('hospitality')) {
    return JOB_HOSPITALITY_FOOD_SCHEMA;
  }

  if (catKey.includes('const') || catKey.includes('trade') || subKey.includes('mason') || subKey.includes('electrician') || subKey.includes('plumber') || catName.includes('construction')) {
    return JOB_CONSTRUCTION_TRADES_SCHEMA;
  }

  if (catKey.includes('health') || catKey.includes('med') || subKey.includes('nurse') || catName.includes('healthcare')) {
    return JOB_HEALTHCARE_SCHEMA;
  }

  if (catKey.includes('edu') || catKey.includes('teach') || subKey.includes('tutor') || catName.includes('education')) {
    return JOB_EDUCATION_SCHEMA;
  }

  if (catKey.includes('beaut') || catKey.includes('fashion') || subKey.includes('barber') || catName.includes('beauty')) {
    return JOB_BEAUTY_FASHION_SCHEMA;
  }

  if (catKey.includes('secur') || subKey.includes('guard') || catName.includes('security')) {
    return JOB_SECURITY_SCHEMA;
  }

  if (catKey.includes('free') || catKey.includes('remote') || subKey.includes('remote') || catName.includes('freelance')) {
    return JOB_FREELANCE_REMOTE_SCHEMA;
  }

  return JOB_GENERIC_FALLBACK_SCHEMA;
}
