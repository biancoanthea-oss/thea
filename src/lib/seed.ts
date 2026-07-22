import type { Block } from "./types";

// Common tender-response themes. Users can add their own; these just seed the sidebar.
export const CATEGORIES = [
  "Company Overview",
  "Experience & Track Record",
  "Case Studies",
  "Method Statement",
  "Health & Safety",
  "Quality Assurance",
  "Environmental & Sustainability",
  "Social Value",
  "Team & Personnel",
  "Pricing Approach",
  "References",
  "Mobilisation & Delivery",
] as const;

function id() {
  return Math.random().toString(36).slice(2, 10);
}

// A few starter blocks so the library isn't empty on first run.
// These are deliberately generic placeholders — edit them to match Stacked's real content.
export function seedBlocks(): Block[] {
  const now = Date.now();
  const base = [
    {
      title: "Company introduction (short)",
      category: "Company Overview",
      tags: ["intro", "boilerplate"],
      content:
        "Stacked is a [describe what Stacked does] delivering [core service] to [type of client]. Established in [year], we have completed [number] projects across [sectors/regions], building a reputation for [key strength] and [key strength]. This submission sets out how we will meet and exceed the requirements of this tender.",
    },
    {
      title: "Health & safety commitment",
      category: "Health & Safety",
      tags: ["health & safety", "compliance"],
      content:
        "Health and safety is embedded in everything we do. We operate a [e.g. ISO 45001-aligned] safety management system, supported by regular risk assessments, method statements (RAMS), toolbox talks and near-miss reporting. All operatives hold [relevant cards/certifications]. Over the past [period] we have maintained an accident frequency rate of [figure], reflecting our proactive safety culture.",
    },
    {
      title: "Quality assurance approach",
      category: "Quality Assurance",
      tags: ["quality", "ISO 9001"],
      content:
        "Our quality management system [e.g. certified to ISO 9001] ensures consistent, right-first-time delivery. Each project is assigned a quality plan with defined checkpoints, inspection and test plans, and sign-off gates. Non-conformances are logged, investigated and closed out with corrective actions, and lessons learned feed back into our continuous improvement process.",
    },
    {
      title: "Social value statement",
      category: "Social Value",
      tags: ["social value", "community"],
      content:
        "We are committed to leaving a positive legacy in the communities where we work. On this contract we will [e.g. create X local jobs / apprenticeships], engage [local supply chain %], and support [community initiative]. Progress against these commitments will be measured and reported [frequency] using [framework, e.g. TOMs / National Social Value Measurement].",
    },
  ];
  return base.map((b) => ({
    id: id(),
    timesUsed: 0,
    createdAt: now,
    updatedAt: now,
    ...b,
  }));
}
