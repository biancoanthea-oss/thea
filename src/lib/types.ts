// Core data model for Tender Studio.
// Everything is stored in the browser (localStorage) so the app works with zero setup.

export interface Block {
  id: string;
  title: string;
  category: string;
  /** Free-form tags for search/filter, e.g. ["health & safety", "ISO 9001"]. */
  tags: string[];
  content: string;
  /** How many times this block has been pulled into a tender — surfaces your greatest hits. */
  timesUsed: number;
  createdAt: number;
  updatedAt: number;
}

export interface TenderSection {
  id: string;
  heading: string;
  content: string;
  /** If this section was inserted from the library, remember which block. */
  sourceBlockId?: string;
}

export type TenderStatus = "draft" | "in-progress" | "submitted" | "won" | "lost";

export interface Tender {
  id: string;
  title: string;
  client: string;
  reference: string;
  dueDate: string; // ISO yyyy-mm-dd, may be empty
  status: TenderStatus;
  notes: string;
  sections: TenderSection[];
  createdAt: number;
  updatedAt: number;
}

/** The full exportable/importable data bundle for backups. */
export interface StudioData {
  version: 1;
  blocks: Block[];
  tenders: Tender[];
}
