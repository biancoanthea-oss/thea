const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  LevelFormat, convertInchesToTwip, Footer, PageNumber,
} = require('docx');

const ACCENT = '1F3864';
const GREY = 'F2F2F2';

// ---------- helpers ----------
const P = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after === undefined ? 140 : opts.after, line: 276 },
  alignment: opts.align,
  indent: opts.indent,
  border: opts.border,
  shading: opts.shading,
  children: Array.isArray(text) ? text : [new TextRun({ text, bold: opts.bold, italics: opts.italics, size: opts.size || 21, color: opts.color, font: 'Calibri' })],
});

const R = (text, opts = {}) => new TextRun({
  text, bold: opts.b, italics: opts.i, size: opts.size || 21, color: opts.color, font: 'Calibri',
});

const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 320, after: 160 },
  children: [new TextRun({ text, bold: true, size: 28, color: ACCENT, font: 'Calibri' })],
});

const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text, bold: true, size: 23, color: ACCENT, font: 'Calibri' })],
});

const BUL = (text, level = 0) => new Paragraph({
  numbering: { reference: 'bullets', level },
  spacing: { after: 90, line: 276 },
  children: Array.isArray(text) ? text : [new TextRun({ text, size: 21, font: 'Calibri' })],
});

const cell = (children, { w, bold, shade, align } = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  shading: shade ? { type: ShadingType.CLEAR, fill: shade, color: 'auto' } : undefined,
  margins: { top: 80, bottom: 80, left: 110, right: 110 },
  children: (Array.isArray(children) ? children : [children]).map((t) =>
    typeof t === 'string'
      ? new Paragraph({ alignment: align, spacing: { after: 0, line: 264 }, children: [new TextRun({ text: t, bold, size: 20, font: 'Calibri' })] })
      : t),
});

const table = (widths, rows) => new Table({
  columnWidths: widths,
  width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
  rows: rows.map((cells, i) => new TableRow({
    tableHeader: i === 0,
    children: cells.map((c, j) => cell(c, { w: widths[j], bold: i === 0, shade: i === 0 ? GREY : undefined })),
  })),
});

const HR = () => new Paragraph({
  spacing: { before: 60, after: 160 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFBFBF' } },
  children: [new TextRun('')],
});

const PH = (text) => new TextRun({ text: `[${text}]`, bold: true, color: 'C00000', size: 21, font: 'Calibri' });

const TW = 9350; // usable A4 width in DXA at 1" margins

// ---------- document body ----------
const body = [];

// Title block
body.push(new Paragraph({
  spacing: { after: 60 },
  children: [R('Response to Preliminary Market Consultation', { b: true, size: 32, color: ACCENT })],
}));
body.push(new Paragraph({
  spacing: { after: 60 },
  children: [R('Audio-Visual Solution and 3-Year Support for DDUH Critical Teaching and Meeting Spaces', { size: 24, color: '404040' })],
}));
body.push(new Paragraph({
  spacing: { after: 240 },
  children: [R('Dublin Dental University Hospital  |  Reference: DDUH-PMC-AV-2026', { size: 21, color: '595959' })],
}));

body.push(table([2400, 6950], [
  ['Field', 'Detail'],
  ['Responding organisation', [new Paragraph({ spacing: { after: 0 }, children: [PH('Company legal name, trading name, registered address, CRO number')] })]],
  ['Contact for this response', [new Paragraph({ spacing: { after: 0 }, children: [PH('Name, job title, email, mobile')] })]],
  ['Date of response', [new Paragraph({ spacing: { after: 0 }, children: [PH('DD Month 2026')] })]],
  ['Submitted via', 'eTenders messaging facility, PMC DDUH-PMC-AV-2026 (FAO Aaron Collins, Procurement Officer)'],
]));

body.push(new Paragraph({ spacing: { after: 120 }, children: [R('')] }));

body.push(new Paragraph({
  spacing: { before: 120, after: 200 },
  shading: { type: ShadingType.CLEAR, fill: 'F7F7F7', color: 'auto' },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT } },
  indent: { left: 160, right: 160 },
  children: [
    R('Status of this response.  ', { b: true, size: 20 }),
    R('This response is provided for the purposes of Preliminary Market Consultation under Regulation 40 of S.I. No. 284 of 2016. It is non-binding, is offered free of charge, and contains no offer capable of acceptance. All costs shown are broad, indicative budget guidance only, based on the outline information available and without a site survey. We understand that relevant information gathered may be shared with all tenderers when the competition is published, and we confirm that nothing in this response is submitted in confidence except where expressly marked. We would welcome the opportunity to participate in the subsequent competition.', { size: 20 }),
  ],
}));

body.push(new Paragraph({ children: [R('')], spacing: { after: 0 }, pageBreakBefore: false }));

// ---- Q1 ----
body.push(H1('1.  Our organisation and relevant experience'));

body.push(H2('1.1  Organisation profile'));
body.push(new Paragraph({
  spacing: { after: 140, line: 276 },
  children: [PH('Insert 150–250 word profile: year established, ownership, Irish base and any other offices, headcount split by function (design/engineering, project management, installation, service desk, field engineers), annual turnover band, and the proportion of work delivered in education and healthcare')],
}));
body.push(P('In summary, our relevance to this requirement is:'));
body.push(BUL([R('In-house AV design capability. ', { b: true }), R('Design is carried out by our own '), PH('n'), R(' AVIXA CTS-D certified designers, working to ANSI/AVIXA standards (including V202.01 DISCAS for image-system design and A103.01 for speech intelligibility). We issue full design packs — schematics, rack elevations, cable schedules, control interface concepts and test plans — rather than an equipment list.')]));
body.push(BUL([R('Live-environment delivery. ', { b: true }), R('We routinely install and commission in occupied teaching, clinical and boardroom environments with phased, out-of-hours and weekend working, under permit-to-work and infection-prevention controls.')]));
body.push(BUL([R('Directly employed service team. ', { b: true }), R('Support is delivered by our own service desk and field engineers based in '), PH('location(s)'), R(', not subcontracted, giving us direct control over response and return-to-operation times.')]));

body.push(H2('1.2  Reference projects'));
body.push(P('The following projects are the closest match in sector, scale and support model. Full references and site-visit access can be provided on request.'));
body.push(table([2500, 3100, 2200, 1550], [
  ['Client / sector', 'Scope delivered', 'Approx. value', 'Year'],
  [[new Paragraph({ spacing: { after: 0 }, children: [PH('Client 1 — higher education')] })], 'Lecture theatre and skills-lab AV design, supply, install, commission; AV-over-IP content distribution; ongoing support', '€[  ]k', '20[  ]'],
  [[new Paragraph({ spacing: { after: 0 }, children: [PH('Client 2 — healthcare / hospital')] })], 'Clinical demonstration and boardroom AV; Microsoft Teams Rooms; managed service with on-site spares', '€[  ]k', '20[  ]'],
  [[new Paragraph({ spacing: { after: 0 }, children: [PH('Client 3 — comparable live environment')] })], 'Multi-room refresh delivered in phases around an operational timetable', '€[  ]k', '20[  ]'],
]));
body.push(P([R('Selection tip: ', { b: true, i: true }), R('choose references where you can evidence (a) a skills-lab or similar many-screen distribution system, (b) a healthcare client with access/IPC constraints, and (c) a multi-year support contract with a hard restoration target — these are the three things DDUH is testing.', { i: true, color: '7F7F7F' })], { size: 19 }));

body.push(H2('1.3  Accreditations and certifications'));
body.push(table([3100, 6250], [
  ['Category', 'Held'],
  ['Quality / environmental', [new Paragraph({ spacing: { after: 0 }, children: [R('ISO 9001:2015 '), PH('cert no.'), R('; ISO 14001:2015 '), PH('cert no.'), R('; ISO 45001 / ISO 27001 '), PH('if held')] })]],
  ['Industry', [new Paragraph({ spacing: { after: 0 }, children: [R('AVIXA CTS ×'), PH('n'), R(', CTS-D ×'), PH('n'), R(', CTS-I ×'), PH('n')] })]],
  ['Manufacturer', [new Paragraph({ spacing: { after: 0 }, children: [PH('e.g. Crestron Certified Programmer / Gold Partner, Extron Authorised, Q-SYS Level 2, Biamp, Shure, Sennheiser, Sony/Panasonic, Barco, Microsoft Teams Rooms')] })]],
  ['Safety / compliance', [new Paragraph({ spacing: { after: 0 }, children: [R('Safe-T-Cert / SafeContractor '), PH('as applicable'), R('; Safety Statement; RAMS per room; Garda vetting and occupational-health screening for personnel working on hospital premises; C2 tax clearance')] })]],
]));

// ---- Q2 ----
body.push(H1('2.  Clinical Skills Lab — live content distribution to ~49 positions'));

body.push(P([R('Short answer: ', { b: true }), R('yes, this is entirely achievable and is a well-established design pattern. For 49 working positions with repeat displays, wireless sharing and live camera demonstration, we would recommend a networked AV (AV-over-IP) distribution system rather than a matrix-and-cable approach.')]));

body.push(H2('2.1  Recommended approach'));
body.push(P([R('Primary recommendation — AV-over-IP with bench-level repeat displays. ', { b: true }), R('A single encoder set at the lecturer position (room PC, laptop input, wireless presentation receiver, document camera, and two PTZ cameras) feeds a managed network; decoders drive the front-of-room displays and the repeat displays around the room. Each bench or pair of benches gets a repeat display so that no student is more than the DISCAS-derived viewing distance from a screen showing the same content at full detail.')]));

body.push(P('Why this rather than the alternatives:'));
body.push(BUL([R('It scales cleanly. ', { b: true }), R('Adding, moving or re-grouping student positions is a patch-and-configure change, not a re-cabling exercise — valuable in a lab whose layout evolves with curriculum.')]));
body.push(BUL([R('It supports independent groups. ', { b: true }), R('Multiple simultaneous streams let you run "everyone follows the lecturer" for a demonstration and then switch to break-out mode where different bench groups view different sources — a common and highly-valued skills-lab requirement that a single distributed HDMI feed cannot deliver.')]));
body.push(BUL([R('It carries the cameras natively. ', { b: true }), R('Intra-oral, document and PTZ camera feeds become just another stream, and can be recorded or joined to a Teams session without a second infrastructure.')]));
body.push(BUL([R('Cable distances stop being a constraint. ', { b: true }), R('Cat6A/fibre runs replace long HDMI/HDBaseT links, and the room is future-proofed to 4K60 4:4:4 and beyond.')]));

body.push(P([R('Codec choice matters and should be specified by outcome, not brand. ', { b: true }), R('For hands-on clinical instruction where students mirror the lecturer\'s actions in real time, we would target sub-frame to one-frame latency and visually lossless 4:4:4 chroma. In practice that points to either a 10GbE uncompressed-class platform (SDVoE) or a high-quality 1GbE JPEG-XS/JPEG2000-class platform. We would not recommend H.264/H.265 streaming for the primary teaching path: its 1–3 second latency breaks "do what I do" instruction and its 4:2:0 chroma degrades the fine detail and small text that dental content depends on. H.264/H.265 is, however, the right tool for the secondary path — recording, lecture capture and remote/Teams viewing.')]));

body.push(P([R('Alternative worth pricing in parallel: ', { b: true }), R('retaining twin front-of-room large-format displays or laser projection for the main image and adding a smaller number of shared repeat displays serving clusters of benches. This is materially cheaper but gives up per-group flexibility. We would suggest DDUH ask tenderers to price both an "all positions" and a "clustered" option so the cost of that flexibility is visible and DDUH can decide with the numbers in front of it.')]));

body.push(H2('2.2  Displays: format and placement'));
body.push(BUL('Front of room: we would move away from projection to direct-view large-format displays where ceiling height and sightlines allow. The lab is a bright, task-lit environment; displays give better contrast, instant-on reliability, no lamp/laser consumable and far less maintenance. Where the existing 2.4m twin screens are needed for scale, modern laser projectors or an LED wall are the alternatives, and we would size against ANSI/AVIXA V202.01 DISCAS for analytical decision-making, not basic decision-making, because students are reading fine anatomical and textual detail.'));
body.push(BUL('Repeat displays: bench-mounted or pendant/pole-mounted screens on articulated mounts so they can be swung out of the way of clinical work and cleaning. Mount loading, bench structural capacity and services routing must be confirmed by survey.'));
body.push(BUL('Surfaces and infection prevention: all screens, mounts and touch surfaces in the lab should be specified as wipeable and compatible with the hospital\'s cleaning agents, with no fabric or open-mesh finishes, and sealed cable entries. This is a genuine constraint that catches out generic AV designs.'));

body.push(H2('2.3  Main technical considerations, constraints and risks'));
body.push(table([2450, 6900], [
  ['Area', 'Consideration / risk and how we would manage it'],
  ['Network ownership', 'AV-over-IP performance is a function of the switch fabric. The single biggest cost and risk variable is whether the AV system runs on a dedicated, AV-supplier-provided and AV-supplier-managed network, or on hospital IT infrastructure. We strongly recommend a dedicated, physically separate AV VLAN/fabric for the lab, with a single documented demarcation point to DDUH IT. It removes a whole class of finger-pointing at fault time.'],
  ['Multicast configuration', 'AV-over-IP is multicast-heavy. IGMP snooping with a querier, appropriate PIM configuration, correctly sized uplinks, jumbo frames and QoS must all be right or the symptom is intermittent, hard-to-diagnose image break-up. This must be specified, tested and documented, not assumed.'],
  ['Latency and lip-sync', 'End-to-end latency budget should be stated as a requirement (we would suggest ≤1 frame for the primary teaching path) with audio-to-video sync maintained across all repeat displays. Mixed-vendor endpoints are the usual cause of drift.'],
  ['Image quality for clinical content', '4K60 at 4:4:4 chroma, high-CRI displays and colour-calibrated camera paths matter for dental work where shade, texture and margin detail are the teaching point. We would recommend a colour-accuracy acceptance test as part of commissioning.'],
  ['Audio intelligibility', 'A 49-position lab is acoustically live and busy. Loudspeaker layout should be designed to a target STI/coverage uniformity, with lecturer radio mic, appropriate gain-before-feedback and, if the room is used for open events, an assistive-listening provision to meet accessibility obligations.'],
  ['Wireless presentation', 'Wireless sharing must be agreed with DDUH IT in advance: appliance-based receivers on the AV VLAN with mDNS/discovery controlled, or a Teams/Miracast route. We would also always retain a wired USB-C/HDMI fallback at the lectern — wireless-only lecterns generate the highest volume of support calls of any single design decision.'],
  ['Recording and GDPR', 'If students, and particularly any patients or patient material, are captured, recording and retention need a defined lawful basis, clear in-room indication that recording is live, and a retention policy. We would design record/stream as an explicit, deliberate action rather than an always-on capability, and align with the DDUH data-protection team.'],
  ['Power, cabling and containment', 'Bench-level displays need power and Cat6A to each position. In an existing building this is frequently the critical-path item and the largest source of cost surprise. A structural, services and (given the building age) asbestos/containment survey should precede design freeze.'],
  ['Disruption to teaching', 'The lab is in continuous term-time use. We would sequence works to the academic calendar, target summer and mid-term breaks for invasive work, and stage the installation so the room can be handed back functional at the end of each work window.'],
  ['Standardisation', 'Selecting one control platform, one DSP platform and one AV-over-IP platform across all four rooms reduces spares holding, shortens fault diagnosis and lowers the cost of the 24-hour restoration target. We would recommend DDUH state this as a design principle.'],
]));

// ---- Q3 ----
body.push(H1('3.  Indicative cost guidance'));
body.push(P([R('The figures below are broad budgetary ranges only, offered to assist DDUH with budget planning as invited. They are not a quotation, are not binding, and are given without a site survey. ', { b: false }), R('Actual cost is driven principally by three variables: the number of repeat display positions in the Clinical Skills Lab, whether the AV network switching is in the AV scope or provided by DDUH IT, and the extent of building works (power, containment, structural support) required.', {})]));

body.push(H2('3.1  (a) AV refresh — design, supply, installation and commissioning'));
body.push(table([2900, 2400, 4050], [
  ['Room', 'Indicative range (ex. VAT)', 'Principal cost drivers'],
  ['Boardroom', '€[  ]k – €[  ]k', 'Display size, Microsoft Teams Rooms certification, ceiling microphone array vs table microphones, DSP and acoustic treatment'],
  ['Lecture Theatre 2', '€[  ]k – €[  ]k', 'Display or projection format, conferencing camera and soundbar vs discrete audio, lecture-capture provision'],
  ['Clinical Skills Lab', '€[  ]k – €[  ]k', 'Number of repeat display positions, AV-over-IP codec class (10GbE vs 1GbE), switch provision, bench power and data works'],
  [[new Paragraph({ spacing: { after: 0 }, children: [R('Total refresh (3 rooms)', { b: true, size: 20, font: 'Calibri' })] })],
   [new Paragraph({ spacing: { after: 0 }, children: [R('€[  ]k – €[  ]k', { b: true, size: 20, font: 'Calibri' })] })],
   'Excludes builder\'s work, structural alterations, decoration and any network core upgrades'],
]));

body.push(H2('3.2  (b) Three-year support and maintenance — all four critical rooms'));
body.push(table([2900, 2400, 4050], [
  ['Element', 'Indicative range (ex. VAT)', 'Notes'],
  ['Annual support, 4 rooms', '€[  ]k – €[  ]k per annum', 'Service desk, remote monitoring, defined response and restoration targets, two preventative maintenance visits per year, software/firmware currency'],
  ['On-site critical spares holding', '€[  ]k – €[  ]k one-off', 'Bonded spares kit held at DDUH to underpin the 24-hour restoration target; replenished on use'],
  [[new Paragraph({ spacing: { after: 0 }, children: [R('Three-year total', { b: true, size: 20, font: 'Calibri' })] })],
   [new Paragraph({ spacing: { after: 0 }, children: [R('€[  ]k – €[  ]k', { b: true, size: 20, font: 'Calibri' })] })],
   'Assumes support commences on practical completion of the refresh; Large Lecture Theatre 1 supported as-is, subject to survey'],
]));

body.push(P([R('Two points DDUH may find useful for budgeting. ', { b: true }), R('First, the Large Lecture Theatre 1 estate is not being refreshed, so its supportability should be established at survey: end-of-life or end-of-support components there can quietly make a 24-hour restoration target unachievable at any price, and it is better to identify and price a small number of targeted component replacements up front than to discover the gap at first failure. Second, a three-year support price is materially lower when the refresh design is standardised across rooms and the supplier commissioned the systems — DDUH will get a better price by awarding refresh and support together than separately.')]));

body.push(P([PH('Commercial team to insert real figures before submission — the ranges above are structure, not our numbers'), R(' ', {})], { size: 19 }));

// ---- Q4 ----
body.push(H1('4.  Delivery timelines and lead times'));

body.push(H2('4.1  Current equipment lead times'));
body.push(table([3600, 2300, 3450], [
  ['Equipment category', 'Typical lead time', 'Comment'],
  ['Large-format displays (up to 86")', '[ 4–8 ] weeks', 'Generally good availability; 98" and larger extends'],
  ['Laser projectors', '[ 8–12 ] weeks', 'High-brightness and specialist lens combinations are the long pole'],
  ['AV-over-IP encoders / decoders', '[ 8–14 ] weeks', 'Historically the most volatile line; ordering early is the single most effective schedule protection'],
  ['DSP, amplifiers, control processors', '[ 8–12 ] weeks', 'Improved but still constrained on some platforms'],
  ['Cameras (PTZ, document, intra-oral)', '[ 6–10 ] weeks', ''],
  ['Microphones and wireless systems', '[ 4–8 ] weeks', 'Confirm ComReg-compliant frequency plan at design stage'],
  ['Network switching for AV-over-IP', '[ 8–16 ] weeks', 'Often the longest single lead time; must be ordered at design freeze'],
  ['Mounts, brackets, bespoke joinery', '[ 6–10 ] weeks', 'Bench and pendant mounts frequently bespoke'],
]));
body.push(P([PH('Refresh these against your current distributor lead times in the week of submission — DDUH will read them as a live market signal'), R('', {})], { size: 19 }));

body.push(H2('4.2  Indicative programme'));
body.push(table([3000, 1900, 4450], [
  ['Stage', 'Duration', 'Notes'],
  ['Survey and stakeholder engagement', '2–3 weeks', 'Room-by-room survey, sightline and structural checks, IT/network workshop, teaching-staff requirements capture'],
  ['Detailed design and design freeze', '3–4 weeks', 'Schematics, rack and mount design, control interface concept, network design signed off with DDUH IT'],
  ['Procurement and staging', '8–16 weeks', 'Runs in parallel with enabling works; long-lead items ordered at design freeze'],
  ['Enabling works (power, containment, structure)', '2–4 weeks', 'Scheduled into breaks; the main variable in an existing building'],
  ['Installation — Boardroom', '1–2 weeks', 'Least disruptive; can proceed independently'],
  ['Installation — Lecture Theatre 2', '2 weeks', 'Out-of-hours or vacation working'],
  ['Installation — Clinical Skills Lab', '3–4 weeks', 'Largest room; benefits most from a vacation window'],
  ['Commissioning, testing and UAT', '1–2 weeks', 'Against a written acceptance test plan agreed in advance'],
  ['Training, documentation and handover', '1 week', 'Academic and technical user training; O&M pack; transition to support'],
  [[new Paragraph({ spacing: { after: 0 }, children: [R('Total (contract award to handover)', { b: true, size: 20, font: 'Calibri' })] })],
   [new Paragraph({ spacing: { after: 0 }, children: [R('18–24 weeks', { b: true, size: 20, font: 'Calibri' })] })],
   'Assumes overlapping procurement and enabling works, and access to rooms as scheduled'],
]));

body.push(P([R('Working in a live clinical and teaching environment. ', { b: true }), R('We would expect a significant proportion of the works — noisy, dusty, or requiring full room possession — to be carried out outside teaching hours, at evenings and weekends, and we would price that in rather than treating it as a variation. In our experience the decisive scheduling factor is not the installation itself but the academic calendar: aligning the Clinical Skills Lab works with a summer or mid-term break typically saves several weeks of elapsed time and removes most of the disruption risk. We would ask DDUH to publish the target room-availability windows in the tender documents so that all tenderers price the same access assumptions.')]));

// ---- Q5 ----
body.push(H1('5.  Support model and 24-hour return-to-operation'));

body.push(P([R('The 24-hour target is realistic and we would support it, provided three things are agreed at design stage: a clear definition of "return to operation", a standardised equipment estate, and an on-site spares holding. Taken together these are what make the target deliverable rather than aspirational.')]));

body.push(H2('5.1  Define return to operation separately from full restoration'));
body.push(P('We would recommend DDUH define two distinct outcomes in the contract:'));
body.push(BUL([R('Return to operation (24 hours): ', { b: true }), R('the room can be used to teach or to hold a meeting to its core purpose — image on screen, audio audible and intelligible, conferencing joinable — potentially via an interim or degraded arrangement such as a bypass input, a loan device or a spare unit.')]));
body.push(BUL([R('Full restoration (defined longer period, e.g. 10 working days): ', { b: true }), R('the system is returned to full designed functionality with a permanent, like-for-like part, and the spares holding replenished.')]));
body.push(P('This distinction is important. It gives DDUH the certainty it actually needs — that teaching never stops for more than a day — without forcing suppliers to price for a manufacturer replacement part appearing overnight, which is what drives support prices up and, on some lines, cannot be honestly promised.'));

body.push(H2('5.2  How we would approach it'));
body.push(table([2600, 6750], [
  ['Layer', 'Approach'],
  ['Design for failure', 'Every room designed with a documented manual bypass: a direct laptop-to-display path that works with the control system, the DSP or the AV-over-IP layer out of service. Teaching continues at a basic level even before we arrive. This costs almost nothing at design stage and is the single most effective measure against a room being unusable.'],
  ['Proactive monitoring', 'All processors, displays, DSPs and endpoints enrolled in a cloud monitoring platform, reporting device health, lamp/laser hours, firmware state and offline events. A meaningful share of faults are then detected and often resolved before the room is next used — the fastest restoration is the one that starts before the call.'],
  ['Remote first response', 'Named service desk with a target remote response of [ 1 ] hour within core hours. Remote reboot, reconfiguration and firmware rollback resolve a large proportion of control and conferencing faults within the same working day.'],
  ['On-site attendance', 'Where remote resolution fails, engineer on site within [ 8 ] working hours, and in all cases in time to meet the 24-hour return-to-operation target for the four critical rooms.'],
  ['On-site spares holding', 'A bonded spares cabinet held at DDUH, contents agreed at design and owned by [ us / DDUH ]. Typical contents: one spare display per size deployed, projector or light-source module, spare encoder and decoder, control processor, DSP, radio microphone receiver and transmitter, camera, PSUs and a cable kit. Replenished within [ 10 ] working days of use.'],
  ['Configuration escrow', 'All control code, DSP files and device configurations version-controlled and held both off-site and on the local spares kit, so a swapped unit is restored to its exact working configuration in minutes rather than reprogrammed. Without this, having a spare on the shelf does not actually deliver a 24-hour restoration.'],
  ['Standardisation', 'Common platforms across all four rooms so one spare covers several rooms and every engineer knows the estate. This is the mechanism that makes the spares holding affordable.'],
  ['Preventative maintenance', '[ Two ] PPM visits per year: filters and optics, firmware currency and security patching, cable and mount integrity, audio and camera calibration, control system verification, plus a pre-term readiness check before each semester.'],
  ['Governance', 'Quarterly service review with SLA performance, fault trends, recurring-issue root cause, firmware/lifecycle roadmap and end-of-life warnings for Large Lecture Theatre 1 equipment.'],
]));

body.push(P([R('One practical caveat we would flag honestly: ', { b: true }), R('Large Lecture Theatre 1 is to be supported without refresh. Where its components are beyond manufacturer support, no supplier can guarantee a permanent like-for-like repair. We would deal with this by surveying it early, agreeing which items are covered by a full restoration commitment and which are covered on a best-endeavours/interim-workaround basis, and offering DDUH the option to purchase a small number of targeted spares to close the gap. We would encourage DDUH to require tenderers to state this explicitly, so that the comparison between bids is honest.')]));

// ---- Q6 ----
body.push(H1('6.  Advice on structuring the subsequent competition'));

body.push(P('DDUH invited suggestions on structuring the competition. The following are offered constructively, and would apply equally to any tenderer.'));

body.push(H2('6.1  A mandatory site visit is strongly recommended'));
body.push(P('For a solution-led, outcome-based competition of this kind the site visit is not a formality — it is what makes good, well-priced proposals possible. The Clinical Skills Lab in particular cannot be designed responsibly from an inventory list: bench layout, sightlines, ceiling heights, existing containment and structural capacity all materially change the design and the price. We would recommend a single mandatory visit, on a fixed date, with all attendees present together, all questions taken in writing afterwards through eTenders, and all answers issued to all participants. Without a site visit, tenderers price risk — which means DDUH pays for it in every bid.'));

body.push(H2('6.2  Package as a single lot'));
body.push(P('We would recommend keeping the refresh of the three rooms and the three-year support for all four rooms in one lot, awarded to one supplier. Single-point responsibility is what makes a 24-hour restoration target enforceable; splitting design/install from support creates a boundary that will be argued over at exactly the moment a lecture theatre is down. It also produces a better support price, because the supporting party commissioned the system and knows it.'));

body.push(H2('6.3  Evaluation and what to ask for'));
body.push(BUL('Weight quality substantially above price — in our view in the region of 60:40 to 70:30 quality:cost. An outcome-based specification that is then awarded on lowest price sends a contradictory signal and tends to attract minimum-compliance designs.'));
body.push(BUL('Ask for a room-by-room design response, including an outline schematic and a stated rationale for the Clinical Skills Lab distribution approach, rather than a bill of materials. Score the design thinking.'));
body.push(BUL('Ask each tenderer to name the individual who will design the solution and evidence their CTS-D or equivalent, and the individual who will project-manage the works. Naming people materially raises the quality of what is proposed.'));
body.push(BUL('Include a short live demonstration or reference-site visit in the evaluation for shortlisted tenderers — particularly valuable for judging latency and image quality claims in the skills-lab distribution system, which cannot be assessed from a written response.'));
body.push(BUL('Score the support and 24-hour restoration methodology as a distinct criterion, and require tenderers to state their spares list and their configuration-backup approach. This exposes the difference between a genuine commitment and a headline number.'));

body.push(H2('6.4  Selection criteria — proportionate thresholds'));
body.push(P('To attract strong specialist AV integrators rather than only the largest general contractors, we would suggest thresholds proportionate to the contract value: annual turnover of roughly twice the estimated annual contract value; two or three references of comparable scope and scale in the last five years, with at least one in a healthcare or education setting; standard insurance levels; ISO 9001 (and 14001 where relevant); and evidence of the safety and vetting arrangements needed to work on a hospital site. Setting turnover or reference thresholds much above that will exclude precisely the specialist AV firms most likely to design this well.'));

body.push(H2('6.5  Microsoft Teams Rooms and M365'));
body.push(BUL('Decide and state up front, for each room, whether it is a certified Microsoft Teams Room, a Teams-capable BYOD/BYOM room, or both. This single decision drives device selection, licensing and cost more than any other, and leaving it open produces incomparable bids.'));
body.push(BUL('State who provides and funds Teams Rooms Pro licences, resource accounts and device management (Teams Admin Center / Intune), and who owns day-two device management — the supplier or DDUH IT. This is the most common source of post-handover dispute we see.'));
body.push(BUL('Involve DDUH IT and information-security colleagues in the tender documents, not just at handover: network provision and demarcation, VLAN and firewall requirements, remote-access method for supplier support, device patching responsibility, and the security review the wireless-presentation solution will have to pass. Publishing those constraints in the ITT lets tenderers price them instead of guessing.'));
body.push(BUL('Confirm the AV network provision explicitly — AV-supplier-supplied switches or DDUH-provided. Left ambiguous, some bids will include it and some will not, and the tender will not be comparing like with like.'));

body.push(H2('6.6  Pricing schedule and contract'));
body.push(BUL('Structure the pricing schedule to capture whole-life cost: capital cost per room, annual support price, priced optional extension years 4 and 5, day rates for out-of-scope work, and the on-site spares holding priced separately. Evaluate on the total.'));
body.push(BUL('Ask for room prices individually as well as in total, so DDUH retains the option to stage the refresh if budget requires.'));
body.push(BUL('Publish the target room-access windows and the academic calendar constraints, and state whether out-of-hours working is expected, so that all tenderers price the same programme.'));
body.push(BUL('Define acceptance clearly — an agreed acceptance test plan, a documented snag process, O&M documentation, as-built drawings, source code and configuration files handed over, and training delivered — and tie final payment to it.'));
body.push(BUL('Allow an adequate tender period. For a design-led response of this kind, six to eight weeks after the site visit produces noticeably better proposals than the minimum.'));
body.push(BUL([R('Consider whether an existing public-sector framework is available and suitable for this requirement, ', {}), R('and if so, whether it shortens the route to award. A direct competition gives a more tailored outcome; a framework may be faster. Either way it is worth a deliberate decision rather than a default.', {})]));

// ---- Closing ----
body.push(HR());
body.push(H1('Closing'));
body.push(P('We would welcome the opportunity to participate in the subsequent competition, to attend a site visit, and to demonstrate a comparable Clinical Skills Lab distribution system at a reference site should that be useful to DDUH at any stage.'));
body.push(P([R('We are happy for the substance of this response to be shared with the market in accordance with the principles of equal treatment, non-discrimination and transparency, save for the reference-project details in Section 1.2, which are provided for DDUH\'s information and are subject to our clients\' consent before wider publication.')]));
body.push(P([R('Contact for any follow-up through the eTenders messaging facility: '), PH('Name, title, email')]));

// ---- Appendix ----
body.push(new Paragraph({ pageBreakBefore: true, spacing: { after: 0 }, children: [R('')] }));
body.push(H1('Appendix — Points we would ask DDUH to clarify in the competition'));
body.push(P('Offered as a checklist; each is a point where an unstated assumption would otherwise produce non-comparable bids.'));
body.push(table([700, 8650], [
  ['#', 'Clarification sought'],
  ['1', 'Is the AV network switching (for AV-over-IP in the Clinical Skills Lab) within the supplier\'s scope, or provided by DDUH IT?'],
  ['2', 'How many student positions require a repeat display — every position, or clustered groups? Is simultaneous multi-source break-out working required?'],
  ['3', 'Which rooms are to be certified Microsoft Teams Rooms, and who funds and holds the Teams Rooms Pro licences and resource accounts?'],
  ['4', 'Is lecture capture / recording required, and to which platform? What is the position on recording where patients or patient material may be in shot?'],
  ['5', 'Are builder\'s work, containment, structural alterations, power and making-good within the AV scope or provided by DDUH?'],
  ['6', 'What room-access windows are available, and what are the academic calendar constraints for each room?'],
  ['7', 'What is the expected supportability position for Large Lecture Theatre 1 equipment that is beyond manufacturer support?'],
  ['8', 'Who owns and funds the on-site spares holding, and where will it be stored?'],
  ['9', 'What remote-access method will DDUH permit for supplier monitoring and support, and what security review must it pass?'],
  ['10', 'Are assistive listening and other accessibility provisions required in each room?'],
  ['11', 'What are the vetting, induction, infection-prevention and permit-to-work requirements for contractor personnel on site?'],
  ['12', 'Is the intended contract award a single lot covering both refresh and support, and is a mandatory site visit planned?'],
]));

// ---------- assemble ----------
const doc = new Document({
  creator: 'PMC Response',
  title: 'DDUH-PMC-AV-2026 — PMC Response',
  description: 'Response to Dublin Dental University Hospital Preliminary Market Consultation DDUH-PMC-AV-2026',
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) } } } },
        { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: convertInchesToTwip(0.6), hanging: convertInchesToTwip(0.2) } } } },
      ],
    }],
  },
  styles: { default: { document: { run: { font: 'Calibri', size: 21 } } } },
  sections: [{
    properties: { page: { margin: { top: 1100, bottom: 1100, left: 1000, right: 1000 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'DDUH-PMC-AV-2026 — Preliminary Market Consultation Response  |  Page ', size: 16, color: '808080', font: 'Calibri' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '808080', font: 'Calibri' }),
            new TextRun({ text: ' of ', size: 16, color: '808080', font: 'Calibri' }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '808080', font: 'Calibri' }),
          ],
        })],
      }),
    },
    children: body,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || 'DDUH-PMC-AV-2026_Response.docx', buf);
  console.log('written');
});
