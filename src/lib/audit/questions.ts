export type QuestionType =
  | "short_text"
  | "single_select"
  | "multi_select"
  | "number"
  | "range"
  | "email";

export type Option = { value: string; label: string; description?: string };

export type Question = {
  id: string;
  category: string;
  type: QuestionType;
  prompt: string; // may contain {{firstName}} / {{businessName}}
  helperText?: string;
  icon?: string;
  options?: Option[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  /** If set, only include when answer to industry equals one of these keys */
  industryVisibility?: string[];
};

export const INDUSTRIES: Option[] = [
  { value: "healthcare", label: "Healthcare" },
  { value: "construction", label: "Construction" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "professional_services", label: "Professional Services" },
  { value: "accounting", label: "Accounting" },
  { value: "legal", label: "Legal" },
  { value: "education", label: "Education" },
  { value: "restaurants", label: "Restaurants" },
  { value: "hospitality", label: "Hospitality" },
  { value: "retail", label: "Retail" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "real_estate", label: "Real Estate" },
  { value: "financial_services", label: "Financial Services" },
  { value: "technology", label: "Technology / SaaS" },
  { value: "other", label: "Other" },
];

/** Welcome + industry pre-branch questions */
export const INTRO_QUESTIONS: Question[] = [
  {
    id: "first_name",
    category: "Welcome",
    type: "short_text",
    prompt: "First, what's your first name?",
    helperText: "We'll personalise your report with it.",
    placeholder: "e.g. Sibongile",
  },
  {
    id: "business_name",
    category: "Welcome",
    type: "short_text",
    prompt: "Nice to meet you, {{firstName}}. What's the business called?",
    helperText: "The legal or trading name works.",
    placeholder: "e.g. Sibiso Marketing",
  },
  {
    id: "industry",
    category: "Industry",
    type: "single_select",
    prompt: "Which industry best describes {{businessName}}?",
    helperText: "We'll tailor the rest of the audit to your sector.",
    options: INDUSTRIES,
  },
];

/** Universal core questions asked to everyone */
export const UNIVERSAL_QUESTIONS: Question[] = [
  {
    id: "revenue_range",
    category: "Business Profile",
    type: "single_select",
    prompt: "What's the current annual revenue range for {{businessName}}?",
    helperText: "Rough estimate is fine — this shapes the recommendations.",
    options: [
      { value: "pre_revenue", label: "Pre-revenue" },
      { value: "under_1m", label: "Under R1M" },
      { value: "1m_5m", label: "R1M – R5M" },
      { value: "5m_20m", label: "R5M – R20M" },
      { value: "20m_100m", label: "R20M – R100M" },
      { value: "100m_plus", label: "R100M+" },
    ],
  },
  {
    id: "primary_lead_source",
    category: "Attract",
    type: "single_select",
    prompt: "Where do most of your leads come from today?",
    helperText: "Pick the single strongest channel.",
    options: [
      { value: "referrals", label: "Referrals & word of mouth" },
      { value: "organic_search", label: "Organic search / SEO" },
      { value: "paid_ads", label: "Paid ads (Google / Meta)" },
      { value: "social", label: "Organic social & content" },
      { value: "outbound", label: "Outbound sales" },
      { value: "events", label: "Events, partnerships & PR" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "crm_usage",
    category: "Convert",
    type: "single_select",
    prompt: "Do you use a CRM to manage leads and customers?",
    options: [
      { value: "no_crm", label: "No CRM — mostly spreadsheets / inbox" },
      { value: "basic_crm", label: "Basic CRM, lightly used" },
      { value: "active_crm", label: "Active CRM with pipeline discipline" },
      { value: "automated_crm", label: "CRM + marketing automation stack" },
    ],
  },
  {
    id: "growth_challenge",
    category: "Diagnostic",
    type: "short_text",
    prompt: "What's the single biggest growth challenge {{businessName}} is facing?",
    helperText: "One or two sentences is perfect.",
    placeholder: "e.g. We get traffic but conversions are flat…",
  },
  {
    id: "growth_goal",
    category: "Goals",
    type: "single_select",
    prompt: "What's your 12-month growth goal?",
    options: [
      { value: "hold", label: "Stabilise & protect current revenue" },
      { value: "grow_25", label: "Grow revenue 25–50%" },
      { value: "grow_100", label: "Double revenue (2×)" },
      { value: "grow_200", label: "Triple or more" },
    ],
  },
  {
    id: "monthly_budget",
    category: "Investment",
    type: "single_select",
    prompt: "What's your realistic monthly marketing budget?",
    helperText: "All in — media, tools, agency, freelancers.",
    options: [
      { value: "under_10k", label: "Under R10k / month" },
      { value: "10_25k", label: "R10k – R25k" },
      { value: "25_75k", label: "R25k – R75k" },
      { value: "75_200k", label: "R75k – R200k" },
      { value: "200k_plus", label: "R200k+ / month" },
    ],
  },
  {
    id: "urgency",
    category: "Timeline",
    type: "single_select",
    prompt: "How urgent is this for you, {{firstName}}?",
    options: [
      { value: "immediate", label: "Immediate — need to move this month" },
      { value: "quarter", label: "This quarter" },
      { value: "half", label: "Within 6 months" },
      { value: "exploring", label: "Just exploring for now" },
    ],
  },
];

/** Industry-specific branches (3-4 questions each) */
export const INDUSTRY_BRANCHES: Record<string, Question[]> = {
  ecommerce: [
    {
      id: "ecom_platform",
      category: "E-commerce",
      type: "single_select",
      prompt: "Which store platform are you on?",
      options: [
        { value: "shopify", label: "Shopify" },
        { value: "woocommerce", label: "WooCommerce" },
        { value: "magento", label: "Magento / Adobe Commerce" },
        { value: "custom", label: "Custom build" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "ecom_aov",
      category: "E-commerce",
      type: "single_select",
      prompt: "What's your typical average order value (AOV)?",
      options: [
        { value: "under_500", label: "Under R500" },
        { value: "500_1500", label: "R500 – R1,500" },
        { value: "1500_5000", label: "R1,500 – R5,000" },
        { value: "5000_plus", label: "R5,000+" },
      ],
    },
    {
      id: "ecom_retention",
      category: "E-commerce",
      type: "single_select",
      prompt: "What % of revenue comes from repeat customers?",
      options: [
        { value: "under_10", label: "Under 10%" },
        { value: "10_30", label: "10–30%" },
        { value: "30_50", label: "30–50%" },
        { value: "50_plus", label: "50%+" },
        { value: "unknown", label: "Not sure" },
      ],
    },
    {
      id: "ecom_bottleneck",
      category: "E-commerce",
      type: "single_select",
      prompt: "Where is the biggest leak in your funnel today?",
      options: [
        { value: "traffic", label: "Traffic / acquisition" },
        { value: "cvr", label: "Product page conversion rate" },
        { value: "cart", label: "Cart & checkout abandonment" },
        { value: "retention", label: "Repeat purchase / retention" },
      ],
    },
  ],
  retail: [
    {
      id: "retail_locations",
      category: "Retail",
      type: "single_select",
      prompt: "How many physical locations does {{businessName}} run?",
      options: [
        { value: "1", label: "1" },
        { value: "2_5", label: "2–5" },
        { value: "6_20", label: "6–20" },
        { value: "20_plus", label: "20+" },
      ],
    },
    {
      id: "retail_online",
      category: "Retail",
      type: "single_select",
      prompt: "Do you also sell online?",
      options: [
        { value: "no", label: "No" },
        { value: "small", label: "Yes — small % of revenue" },
        { value: "meaningful", label: "Yes — meaningful channel" },
        { value: "dominant", label: "Online is our biggest channel" },
      ],
    },
    {
      id: "retail_loyalty",
      category: "Retail",
      type: "single_select",
      prompt: "Do you run a loyalty or CRM programme?",
      options: [
        { value: "none", label: "No" },
        { value: "basic", label: "Basic (email list only)" },
        { value: "formal", label: "Formal loyalty programme" },
      ],
    },
  ],
  professional_services: [
    {
      id: "ps_deal_size",
      category: "Professional Services",
      type: "single_select",
      prompt: "What's your typical engagement / deal size?",
      options: [
        { value: "under_25k", label: "Under R25k" },
        { value: "25_100k", label: "R25k – R100k" },
        { value: "100_500k", label: "R100k – R500k" },
        { value: "500k_plus", label: "R500k+" },
      ],
    },
    {
      id: "ps_sales_cycle",
      category: "Professional Services",
      type: "single_select",
      prompt: "How long is your average sales cycle?",
      options: [
        { value: "under_month", label: "Under a month" },
        { value: "1_3", label: "1–3 months" },
        { value: "3_6", label: "3–6 months" },
        { value: "6_plus", label: "6+ months" },
      ],
    },
    {
      id: "ps_lead_gen",
      category: "Professional Services",
      type: "multi_select",
      prompt: "Which lead-gen motions are working for you today?",
      helperText: "Select all that apply.",
      options: [
        { value: "referrals", label: "Referrals" },
        { value: "thought_leadership", label: "Thought leadership / content" },
        { value: "outbound", label: "Outbound sales" },
        { value: "events", label: "Events & speaking" },
        { value: "partnerships", label: "Strategic partnerships" },
        { value: "seo", label: "SEO & organic search" },
      ],
    },
    {
      id: "ps_positioning",
      category: "Professional Services",
      type: "short_text",
      prompt: "In one sentence, who is your ideal client?",
      placeholder: "e.g. Mid-market law firms in SA scaling their commercial practice",
    },
  ],
  legal: [
    {
      id: "legal_practice_area",
      category: "Legal",
      type: "single_select",
      prompt: "What's your primary practice area?",
      options: [
        { value: "commercial", label: "Commercial / corporate" },
        { value: "litigation", label: "Litigation" },
        { value: "family", label: "Family / private client" },
        { value: "property", label: "Property / conveyancing" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "legal_matters",
      category: "Legal",
      type: "single_select",
      prompt: "Roughly how many new matters do you take on each month?",
      options: [
        { value: "0_5", label: "0–5" },
        { value: "5_20", label: "5–20" },
        { value: "20_50", label: "20–50" },
        { value: "50_plus", label: "50+" },
      ],
    },
    {
      id: "legal_intake",
      category: "Legal",
      type: "single_select",
      prompt: "How is client intake handled today?",
      options: [
        { value: "manual", label: "Manual — email / phone" },
        { value: "form", label: "Web form to inbox" },
        { value: "crm", label: "CRM with structured intake" },
        { value: "automated", label: "Automated intake + qualification" },
      ],
    },
  ],
  accounting: [
    {
      id: "acc_clients",
      category: "Accounting",
      type: "single_select",
      prompt: "How many active clients does the practice serve?",
      options: [
        { value: "under_25", label: "Under 25" },
        { value: "25_100", label: "25–100" },
        { value: "100_500", label: "100–500" },
        { value: "500_plus", label: "500+" },
      ],
    },
    {
      id: "acc_recurring",
      category: "Accounting",
      type: "single_select",
      prompt: "What share of revenue is recurring (monthly / annual retainers)?",
      options: [
        { value: "under_25", label: "Under 25%" },
        { value: "25_60", label: "25–60%" },
        { value: "60_plus", label: "60%+" },
      ],
    },
    {
      id: "acc_growth",
      category: "Accounting",
      type: "single_select",
      prompt: "What's your biggest growth blocker?",
      options: [
        { value: "capacity", label: "Team capacity" },
        { value: "leads", label: "New client pipeline" },
        { value: "pricing", label: "Pricing / packaging" },
        { value: "tech", label: "Tech stack & automation" },
      ],
    },
  ],
  healthcare: [
    {
      id: "hc_setting",
      category: "Healthcare",
      type: "single_select",
      prompt: "What kind of healthcare business is this?",
      options: [
        { value: "private_practice", label: "Private practice / clinic" },
        { value: "multi_site", label: "Multi-site group" },
        { value: "hospital", label: "Hospital / large facility" },
        { value: "wellness", label: "Wellness / allied health" },
      ],
    },
    {
      id: "hc_booking",
      category: "Healthcare",
      type: "single_select",
      prompt: "How do patients book appointments today?",
      options: [
        { value: "phone", label: "Phone only" },
        { value: "phone_web", label: "Phone + basic web form" },
        { value: "online_booking", label: "Online booking system" },
        { value: "integrated", label: "Integrated with PMS + reminders" },
      ],
    },
    {
      id: "hc_referrals",
      category: "Healthcare",
      type: "single_select",
      prompt: "What % of new patients come from referrals (medical or word of mouth)?",
      options: [
        { value: "under_25", label: "Under 25%" },
        { value: "25_60", label: "25–60%" },
        { value: "60_plus", label: "60%+" },
      ],
    },
    {
      id: "hc_reviews",
      category: "Healthcare",
      type: "single_select",
      prompt: "Do you actively manage online reviews & reputation?",
      options: [
        { value: "no", label: "No" },
        { value: "adhoc", label: "Ad hoc" },
        { value: "systematic", label: "Yes, systematic process" },
      ],
    },
  ],
  real_estate: [
    {
      id: "re_role",
      category: "Real Estate",
      type: "single_select",
      prompt: "Which best describes {{businessName}}?",
      options: [
        { value: "agent", label: "Individual agent / small team" },
        { value: "agency", label: "Agency / brokerage" },
        { value: "developer", label: "Developer" },
        { value: "commercial", label: "Commercial real estate" },
      ],
    },
    {
      id: "re_listings",
      category: "Real Estate",
      type: "single_select",
      prompt: "Roughly how many active listings do you carry?",
      options: [
        { value: "under_10", label: "Under 10" },
        { value: "10_50", label: "10–50" },
        { value: "50_200", label: "50–200" },
        { value: "200_plus", label: "200+" },
      ],
    },
    {
      id: "re_lead_channel",
      category: "Real Estate",
      type: "single_select",
      prompt: "Where do most qualified leads come from today?",
      options: [
        { value: "portals", label: "Property portals (Property24, Private Property)" },
        { value: "referrals", label: "Referrals" },
        { value: "paid_ads", label: "Paid social / Google ads" },
        { value: "organic", label: "Organic — SEO & content" },
      ],
    },
    {
      id: "re_nurture",
      category: "Real Estate",
      type: "single_select",
      prompt: "Do you have a nurture system for buyers not ready today?",
      options: [
        { value: "no", label: "No — one and done" },
        { value: "manual", label: "Manual follow-ups" },
        { value: "automated", label: "Automated nurture journeys" },
      ],
    },
  ],
  technology: [
    {
      id: "tech_stage",
      category: "Technology / SaaS",
      type: "single_select",
      prompt: "What stage is the company at?",
      options: [
        { value: "pre_pmf", label: "Pre product-market fit" },
        { value: "early_growth", label: "Early growth (finding what works)" },
        { value: "scale", label: "Scaling (repeatable GTM)" },
        { value: "mature", label: "Mature / expansion" },
      ],
    },
    {
      id: "tech_motion",
      category: "Technology / SaaS",
      type: "single_select",
      prompt: "What's your primary GTM motion?",
      options: [
        { value: "plg", label: "Product-led (self-serve)" },
        { value: "sales_led", label: "Sales-led" },
        { value: "hybrid", label: "Hybrid / PLG + sales" },
        { value: "partnerships", label: "Partner / channel-led" },
      ],
    },
    {
      id: "tech_arr",
      category: "Technology / SaaS",
      type: "single_select",
      prompt: "What's your current ARR range?",
      options: [
        { value: "pre", label: "Pre-revenue" },
        { value: "under_500k", label: "Under R500k ARR" },
        { value: "500k_5m", label: "R500k – R5M ARR" },
        { value: "5m_25m", label: "R5M – R25M ARR" },
        { value: "25m_plus", label: "R25M+ ARR" },
      ],
    },
    {
      id: "tech_activation",
      category: "Technology / SaaS",
      type: "single_select",
      prompt: "Do you measure activation & time-to-value?",
      options: [
        { value: "no", label: "No" },
        { value: "informal", label: "Informally" },
        { value: "yes", label: "Yes — instrumented & tracked" },
      ],
    },
  ],
  hospitality: [
    {
      id: "hosp_type",
      category: "Hospitality",
      type: "single_select",
      prompt: "Which best describes {{businessName}}?",
      options: [
        { value: "hotel", label: "Hotel / lodge" },
        { value: "guesthouse", label: "Guesthouse / B&B" },
        { value: "resort", label: "Resort / destination" },
        { value: "vacation_rental", label: "Vacation rental portfolio" },
      ],
    },
    {
      id: "hosp_channels",
      category: "Hospitality",
      type: "multi_select",
      prompt: "Where do bookings come from today?",
      options: [
        { value: "direct", label: "Direct site" },
        { value: "booking", label: "Booking.com / Expedia" },
        { value: "airbnb", label: "Airbnb" },
        { value: "corporate", label: "Corporate / agency" },
        { value: "referral", label: "Referrals" },
      ],
    },
    {
      id: "hosp_direct_share",
      category: "Hospitality",
      type: "single_select",
      prompt: "What % of bookings come direct (not via OTAs)?",
      options: [
        { value: "under_20", label: "Under 20%" },
        { value: "20_50", label: "20–50%" },
        { value: "50_plus", label: "50%+" },
      ],
    },
  ],
  restaurants: [
    {
      id: "rest_type",
      category: "Restaurants",
      type: "single_select",
      prompt: "Which best describes the concept?",
      options: [
        { value: "quick_service", label: "Quick service" },
        { value: "casual", label: "Casual dining" },
        { value: "fine", label: "Fine dining" },
        { value: "multi_brand", label: "Multi-brand / group" },
      ],
    },
    {
      id: "rest_delivery",
      category: "Restaurants",
      type: "single_select",
      prompt: "Do you offer delivery / takeaway?",
      options: [
        { value: "no", label: "No" },
        { value: "aggregators", label: "Yes via aggregators (Uber Eats, Mr D)" },
        { value: "own", label: "Yes on our own channels" },
        { value: "both", label: "Both aggregators + own" },
      ],
    },
    {
      id: "rest_returning",
      category: "Restaurants",
      type: "single_select",
      prompt: "How healthy is your repeat customer base?",
      options: [
        { value: "weak", label: "Weak — mostly new / walk-ins" },
        { value: "ok", label: "OK — some regulars" },
        { value: "strong", label: "Strong — loyal regulars" },
      ],
    },
  ],
  construction: [
    {
      id: "con_type",
      category: "Construction",
      type: "single_select",
      prompt: "Which best describes {{businessName}}?",
      options: [
        { value: "residential", label: "Residential builder / contractor" },
        { value: "commercial", label: "Commercial contractor" },
        { value: "specialist", label: "Specialist trade (plumbing, electrical, etc.)" },
        { value: "developer", label: "Property developer" },
      ],
    },
    {
      id: "con_project_size",
      category: "Construction",
      type: "single_select",
      prompt: "What's your typical project size?",
      options: [
        { value: "under_250k", label: "Under R250k" },
        { value: "250k_2m", label: "R250k – R2M" },
        { value: "2m_10m", label: "R2M – R10M" },
        { value: "10m_plus", label: "R10M+" },
      ],
    },
    {
      id: "con_pipeline",
      category: "Construction",
      type: "single_select",
      prompt: "How healthy is your project pipeline for the next 6 months?",
      options: [
        { value: "empty", label: "Empty — chasing every job" },
        { value: "patchy", label: "Patchy — some gaps" },
        { value: "steady", label: "Steady — booked out" },
        { value: "overflowing", label: "Overflowing — turning work away" },
      ],
    },
    {
      id: "con_lead_source",
      category: "Construction",
      type: "single_select",
      prompt: "Where do most quality leads come from today?",
      options: [
        { value: "referrals", label: "Referrals & repeat clients" },
        { value: "tenders", label: "Tenders / RFPs" },
        { value: "google", label: "Google search / Maps" },
        { value: "social", label: "Social proof (Instagram, showcases)" },
      ],
    },
  ],
  manufacturing: [
    {
      id: "mfg_model",
      category: "Manufacturing",
      type: "single_select",
      prompt: "Which best describes the operation?",
      options: [
        { value: "b2b", label: "B2B — sell to other businesses" },
        { value: "b2c", label: "B2C — sell to consumers" },
        { value: "contract", label: "Contract / white-label manufacturer" },
        { value: "hybrid", label: "Hybrid mix" },
      ],
    },
    {
      id: "mfg_distribution",
      category: "Manufacturing",
      type: "single_select",
      prompt: "How do you get product to customers?",
      options: [
        { value: "direct", label: "Direct sales team" },
        { value: "distributors", label: "Distributors / wholesalers" },
        { value: "retail", label: "Retail partners" },
        { value: "mixed", label: "Mixed channels" },
      ],
    },
    {
      id: "mfg_capacity",
      category: "Manufacturing",
      type: "single_select",
      prompt: "What's your current capacity utilisation?",
      options: [
        { value: "under_50", label: "Under 50% — lots of headroom" },
        { value: "50_80", label: "50–80%" },
        { value: "80_plus", label: "80%+ — near max" },
      ],
    },
    {
      id: "mfg_growth_lever",
      category: "Manufacturing",
      type: "single_select",
      prompt: "Which lever would move the needle most right now?",
      options: [
        { value: "new_accounts", label: "Opening new accounts" },
        { value: "wallet", label: "Growing wallet-share of existing accounts" },
        { value: "export", label: "Export / new geographies" },
        { value: "new_product", label: "Launching new product lines" },
      ],
    },
  ],
  education: [
    {
      id: "edu_type",
      category: "Education",
      type: "single_select",
      prompt: "Which best describes {{businessName}}?",
      options: [
        { value: "school", label: "School / academy" },
        { value: "tertiary", label: "Tertiary / college" },
        { value: "online_courses", label: "Online courses / edtech" },
        { value: "training", label: "Corporate training provider" },
      ],
    },
    {
      id: "edu_intake_cycle",
      category: "Education",
      type: "single_select",
      prompt: "How does enrolment work?",
      options: [
        { value: "rolling", label: "Rolling — sign-ups any time" },
        { value: "termly", label: "Termly / quarterly intakes" },
        { value: "annual", label: "Annual intake" },
      ],
    },
    {
      id: "edu_funnel_stage",
      category: "Education",
      type: "single_select",
      prompt: "Where does the enrolment funnel break down most?",
      options: [
        { value: "awareness", label: "Awareness — not enough enquiries" },
        { value: "info", label: "Prospectus requests don't convert to applications" },
        { value: "apply", label: "Applications don't complete / pay" },
        { value: "retention", label: "Students don't renew / progress" },
      ],
    },
  ],
  financial_services: [
    {
      id: "fin_type",
      category: "Financial Services",
      type: "single_select",
      prompt: "Which best describes the practice?",
      options: [
        { value: "advisory", label: "Wealth / financial advisory" },
        { value: "insurance", label: "Insurance / brokerage" },
        { value: "lending", label: "Lending / credit" },
        { value: "fintech", label: "Fintech product" },
      ],
    },
    {
      id: "fin_aum",
      category: "Financial Services",
      type: "single_select",
      prompt: "What's your assets-under-management or book size?",
      options: [
        { value: "under_50m", label: "Under R50M" },
        { value: "50_500m", label: "R50M – R500M" },
        { value: "500m_plus", label: "R500M+" },
        { value: "na", label: "Not applicable" },
      ],
    },
    {
      id: "fin_client_source",
      category: "Financial Services",
      type: "single_select",
      prompt: "Where do new clients primarily come from today?",
      options: [
        { value: "referrals", label: "Referrals" },
        { value: "coi", label: "Centres of influence (accountants, lawyers)" },
        { value: "digital", label: "Digital marketing" },
        { value: "outbound", label: "Outbound / cold outreach" },
      ],
    },
    {
      id: "fin_trust",
      category: "Financial Services",
      type: "single_select",
      prompt: "How systematically do you build trust with prospects (content, reviews, thought leadership)?",
      options: [
        { value: "none", label: "Not at all" },
        { value: "adhoc", label: "Ad hoc" },
        { value: "systematic", label: "Systematically, on a schedule" },
      ],
    },
  ],
};

/** Fallback branch used for "Other" or industries without a dedicated set. */
export const GENERIC_BRANCH: Question[] = [
  {
    id: "gen_ideal_customer",
    category: "Positioning",
    type: "short_text",
    prompt: "In one sentence, who is your ideal customer?",
    placeholder: "Describe them by role, size or life stage.",
  },
  {
    id: "gen_differentiator",
    category: "Positioning",
    type: "single_select",
    prompt: "What's your strongest competitive edge?",
    options: [
      { value: "price", label: "Price / value" },
      { value: "quality", label: "Quality / craftsmanship" },
      { value: "expertise", label: "Deep expertise" },
      { value: "speed", label: "Speed / convenience" },
      { value: "brand", label: "Brand & story" },
    ],
  },
  {
    id: "gen_biggest_leak",
    category: "Funnel",
    type: "single_select",
    prompt: "Where do you leak the most potential revenue?",
    options: [
      { value: "awareness", label: "Not enough people know about us" },
      { value: "consideration", label: "They know us but don't convert" },
      { value: "close", label: "We lose deals late in the process" },
      { value: "retention", label: "Customers don't come back" },
    ],
  },
];

/** Closing questions asked to everyone */
export const CLOSING_QUESTIONS: Question[] = [
  {
    id: "ai_adoption",
    category: "AI & Automation",
    type: "single_select",
    prompt: "How deeply is AI or automation woven into how you operate today?",
    options: [
      { value: "none", label: "Not at all" },
      { value: "exploring", label: "Exploring / experimenting" },
      { value: "some", label: "In a few workflows" },
      { value: "deep", label: "Core to how we operate" },
    ],
  },
  {
    id: "operational_bottleneck",
    category: "Operations",
    type: "short_text",
    prompt: "Last one, {{firstName}} — what's the biggest operational bottleneck holding growth back?",
    placeholder: "e.g. Can't hire fast enough, delivery is manual…",
  },
];

/** Build the full ordered list for a given industry answer */
export function buildQuestionFlow(industry?: string): Question[] {
  const branch = industry && INDUSTRY_BRANCHES[industry] ? INDUSTRY_BRANCHES[industry] : GENERIC_BRANCH;
  return [...INTRO_QUESTIONS, ...UNIVERSAL_QUESTIONS, ...branch, ...CLOSING_QUESTIONS];
}

/** Rough total for a progress indicator before industry is known */
export const ESTIMATED_TOTAL = INTRO_QUESTIONS.length + UNIVERSAL_QUESTIONS.length + 4 + CLOSING_QUESTIONS.length;

export function interpolate(prompt: string, answers: Record<string, unknown>): string {
  const first = String(answers.first_name ?? "").trim() || "there";
  const biz = String(answers.business_name ?? "").trim() || "your business";
  return prompt.replaceAll("{{firstName}}", first).replaceAll("{{businessName}}", biz);
}
