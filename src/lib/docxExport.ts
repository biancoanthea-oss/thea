"use client";

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
} from "docx";
import type { Tender } from "./types";

function paragraphsFromText(text: string): Paragraph[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  // Collapse runs of blank lines but keep paragraph breaks.
  const out: Paragraph[] = [];
  for (const line of lines) {
    if (line.trim() === "") {
      out.push(new Paragraph({ spacing: { after: 120 } }));
    } else {
      out.push(
        new Paragraph({
          spacing: { after: 160, line: 300 },
          children: [new TextRun({ text: line, size: 22 })],
        })
      );
    }
  }
  if (out.length === 0) out.push(new Paragraph({}));
  return out;
}

export async function downloadTenderDocx(tender: Tender) {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 80 },
      children: [
        new TextRun({ text: tender.title || "Tender", bold: true, size: 40 }),
      ],
    })
  );

  const metaBits = [
    tender.client && `Client: ${tender.client}`,
    tender.reference && `Reference: ${tender.reference}`,
    tender.dueDate && `Due: ${tender.dueDate}`,
  ].filter(Boolean) as string[];

  if (metaBits.length) {
    children.push(
      new Paragraph({
        spacing: { after: 320 },
        children: [
          new TextRun({ text: metaBits.join("   ·   "), size: 20, color: "6b7385" }),
        ],
      })
    );
  }

  tender.sections.forEach((section, i) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: i === 0 ? 0 : 280, after: 120 },
        children: [
          new TextRun({ text: `${i + 1}. ${section.heading}`, bold: true, size: 28 }),
        ],
      })
    );
    children.push(...paragraphsFromText(section.content));
  });

  if (tender.sections.length === 0) {
    children.push(
      new Paragraph({ children: [new TextRun({ text: "(No sections yet.)", italics: true })] })
    );
  }

  const doc = new Document({
    creator: "Tender Studio",
    title: tender.title,
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safe = (tender.title || "tender").replace(/[^\w\- ]+/g, "").trim() || "tender";
  a.href = url;
  a.download = `${safe}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
