import type {
  BenefitIconName,
  JobApiRecord,
  JobBenefit,
  JobDetails,
  JobPost,
} from "@/types/jobs";
import { formatSalary } from "@/lib/jobs/format";
import { toJobPost } from "@/lib/jobs/normalize";

const asRecord = (value: unknown): JobApiRecord | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as JobApiRecord)
    : null;

const asString = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
};

const textList = (value: unknown, separator = /\r?\n/): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => {
      const text = asString(entry);
      return text ? [text] : [];
    });
  }

  const text = asString(value);
  if (!text) return [];

  return text
    .split(separator)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
};

const listFrom = (value: unknown): string[] =>
  textList(value, /[,;\n]/);

/* -------------------------------------------------------------------------- */
/* Fallback content                                                           */
/* -------------------------------------------------------------------------- */

type RoleContent = {
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  industry: string;
};

const roleContent: Record<string, RoleContent> = {
  design: {
    responsibilities: [
      "Lead design work from early concept through a polished launch.",
      "Partner with product and engineering to turn requirements into intuitive flows.",
      "Contribute to and maintain the shared design system.",
      "Validate decisions with research, prototypes and usability testing.",
    ],
    qualifications: [
      "3+ years designing consumer or B2B digital products.",
      "A portfolio showing end-to-end product design work.",
      "Strong systems thinking and attention to interaction detail.",
      "Clear written and verbal communication skills.",
    ],
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
    industry: "Design & Creative",
  },
  engineering: {
    responsibilities: [
      "Build and ship features across the product surface.",
      "Write maintainable, well-tested code and review peers' changes.",
      "Work with product and design to scope and refine requirements.",
      "Improve performance, reliability and developer experience.",
    ],
    qualifications: [
      "3+ years building production web applications.",
      "Strong TypeScript and JavaScript fundamentals.",
      "Experience with modern frameworks and component-based UI.",
      "Comfort debugging problems across the stack.",
    ],
    skills: ["TypeScript", "React", "Node.js", "Testing"],
    industry: "Software & SaaS",
  },
  product: {
    responsibilities: [
      "Own a product area from discovery through delivery.",
      "Turn user insight into a clear, prioritised roadmap.",
      "Write specs and acceptance criteria the team can build from.",
      "Measure outcomes and iterate based on the data.",
    ],
    qualifications: [
      "3+ years of product management experience.",
      "Experience shipping customer-facing features end to end.",
      "Strong analytical and communication skills.",
      "Comfort working closely with design and engineering.",
    ],
    skills: ["Product Strategy", "Discovery", "Analytics", "Roadmapping"],
    industry: "Software & SaaS",
  },
  marketing: {
    responsibilities: [
      "Plan and run campaigns that drive qualified pipeline.",
      "Own messaging and positioning across channels.",
      "Partner with product on launches and go-to-market plans.",
      "Track performance and double down on what works.",
    ],
    qualifications: [
      "3+ years of marketing experience for a B2B or SaaS product.",
      "Strong writing and editorial skills.",
      "Experience with analytics and campaign measurement.",
      "Ability to manage several projects at once.",
    ],
    skills: ["Positioning", "Go-to-market", "Content", "Analytics"],
    industry: "Marketing & Growth",
  },
  sales: {
    responsibilities: [
      "Own the full sales cycle from prospecting to close.",
      "Build relationships with decision-makers and champions.",
      "Keep the pipeline accurate and the forecast reliable.",
      "Feed customer insight back to product and marketing.",
    ],
    qualifications: [
      "2+ years in a quota-carrying sales role.",
      "Excellent discovery and objection-handling skills.",
      "CRM discipline and clear written follow-ups.",
      "Comfort in a fast-moving, consultative environment.",
    ],
    skills: ["Prospecting", "Negotiation", "CRM", "Forecasting"],
    industry: "Business Services",
  },
  operations: {
    responsibilities: [
      "Keep day-to-day operations running smoothly across teams.",
      "Build repeatable processes and document what works.",
      "Identify bottlenecks and drive measurable improvements.",
      "Coordinate with vendors and internal stakeholders.",
    ],
    qualifications: [
      "2+ years in operations or program management.",
      "Strong organisational and prioritisation skills.",
      "Comfort working with spreadsheets and operational data.",
      "Clear, proactive communication.",
    ],
    skills: ["Process Design", "Project Management", "Data Analysis", "Vendors"],
    industry: "Business Services",
  },
  finance: {
    responsibilities: [
      "Own reporting and analysis for the business area.",
      "Build models that support planning and investment decisions.",
      "Partner with team leads to manage budgets and forecasts.",
      "Improve financial controls and reporting accuracy.",
    ],
    qualifications: [
      "3+ years in finance, FP&A or accounting.",
      "Strong modelling and spreadsheet skills.",
      "Attention to detail and clear communication.",
      "Experience partnering with non-finance teams.",
    ],
    skills: ["Financial Modelling", "FP&A", "Reporting", "Excel"],
    industry: "Financial Services",
  },
  people: {
    responsibilities: [
      "Partner with leaders on hiring, growth and performance.",
      "Own people programs from design through rollout.",
      "Keep policies accurate, fair and easy to understand.",
      "Use people data to spot trends and improve the experience.",
    ],
    qualifications: [
      "3+ years in people operations or HR.",
      "Knowledge of employment practices and compliance.",
      "Strong coaching and communication skills.",
      "Discretion with sensitive information.",
    ],
    skills: ["Talent Management", "Employee Relations", "People Analytics", "Compliance"],
    industry: "Professional Services",
  },
  general: {
    responsibilities: [
      "Take ownership of day-to-day work for the team.",
      "Collaborate with partners across the business.",
      "Improve how the team works and what it ships.",
      "Communicate progress clearly and escalate blockers early.",
    ],
    qualifications: [
      "3+ years of relevant professional experience.",
      "A track record of delivering work independently.",
      "Strong communication and collaboration skills.",
      "Comfort in a fast-moving environment.",
    ],
    skills: ["Communication", "Ownership", "Problem Solving", "Collaboration"],
    industry: "Business Services",
  },
};

const resolveGroup = (department: string): keyof typeof roleContent => {
  const value = department.toLowerCase();

  if (value.includes("design")) return "design";
  if (value.includes("market") || value.includes("growth")) return "marketing";
  if (value.includes("product")) return "product";
  if (value.includes("sales") || value.includes("business")) return "sales";
  if (value.includes("finance") || value.includes("account")) return "finance";
  if (value.includes("people") || value.includes("hr")) return "people";
  if (value.includes("operation")) return "operations";
  if (
    value.includes("infra") ||
    value.includes("devops") ||
    value.includes("engineer") ||
    value.includes("tech") ||
    value.includes("data") ||
    value.includes("software")
  ) {
    return "engineering";
  }

  return "general";
};

const defaultBenefits: JobBenefit[] = [
  { label: "Full Health & Dental", icon: "health" },
  { label: "Competitive 401K", icon: "retirement" },
  { label: "Latest Hardware Stipend", icon: "hardware" },
  { label: "Unlimited PTO", icon: "pto" },
];

const benefitIcon = (label: string): BenefitIconName => {
  const value = label.toLowerCase();

  if (/health|dental|medical|vision/.test(value)) return "health";
  if (/401|pension|retir|equity/.test(value)) return "retirement";
  if (/hardware|laptop|equipment|stipend/.test(value)) return "hardware";
  if (/pto|vacation|leave|time off/.test(value)) return "pto";
  if (/remote|home|flexible/.test(value)) return "remote";
  if (/learn|education|course|budget/.test(value)) return "learning";

  return "pto";
};

const parseBenefits = (value: unknown): JobBenefit[] =>
  textList(value, /\r?\n|;/).map((label) => ({
    label,
    icon: benefitIcon(label),
  }));

const describe = (job: JobPost): string => {
  const type =
    job.employmentType && job.employmentType !== "—"
      ? ` ${job.employmentType.toLowerCase()}`
      : "";

  return `${job.company} is hiring a ${job.title} to join its ${job.department} team. This${type} role is based in ${job.location}, with a compensation range of ${formatSalary(job.salary)}.

You'll work with cross-functional partners to ship work that matters, with room to shape both the role and the product. The team is looking for someone who communicates clearly, takes ownership, and cares about the details.`;
};

const experienceFor = (title: string): string => {
  if (/senior|lead|principal|staff|head|director/i.test(title)) return "5+ Years";
  if (/junior|intern|entry|associate/i.test(title)) return "0–2 Years";
  return "3+ Years";
};

const companySizeFor = (company: string): string => {
  const sizes = ["51 - 200 Employees", "201 - 500 Employees", "501 - 1,000 Employees"];
  const score = [...company].reduce((total, char) => total + char.charCodeAt(0), 0);
  return sizes[score % sizes.length];
};

const websiteFor = (record: JobApiRecord, company: string): string => {
  const explicit = asString(record.website);
  if (explicit) return /^https?:\/\//i.test(explicit) ? explicit : `https://${explicit}`;

  return `https://www.google.com/search?q=${encodeURIComponent(`${company} official website`)}`;
};

/* -------------------------------------------------------------------------- */
/* Mapper                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Extends the shared `JobPost` with the content the detail page needs.
 * Seeds in the API lack description/benefits, so missing sections fall back
 * to deterministic, role-appropriate copy instead of rendering empty blocks.
 */
export const toJobDetails = (raw: unknown, index = 0): JobDetails | null => {
  const record = asRecord(raw);
  const job = toJobPost(raw, index);

  if (!record || !job) return null;

  const group = roleContent[resolveGroup(job.department)];
  const responsibilities = textList(record.responsibilities);
  const qualifications = textList(record.qualifications);
  const skills = listFrom(record.skills);
  const benefits = parseBenefits(record.benefits);

  return {
    ...job,
    description: asString(record.description) ?? asString(record.summary) ?? describe(job),
    responsibilities: responsibilities.length
      ? responsibilities
      : group.responsibilities,
    qualifications: qualifications.length
      ? qualifications
      : group.qualifications,
    skills: skills.length ? skills : group.skills,
    benefits: benefits.length ? benefits : defaultBenefits,
    experience: asString(record.experience) ?? experienceFor(job.title),
    companySize: asString(record.companySize) ?? companySizeFor(job.company),
    industry: asString(record.industry) ?? group.industry,
    website: websiteFor(record, job.company),
    verified: record.verified !== false,
  };
};
