import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GENERATED_TYPST_DIR = path.join(ROOT, "typst", "generated");

const FULL_MARKDOWN = path.join(ROOT, "README.md");
const BRIEF_MARKDOWN = path.join(ROOT, "Brief_Resume.MD");

const ATS_FULL_PDF = path.join(ROOT, "filip_szalewicz_resume.pdf");
const ATS_BRIEF_PDF = path.join(ROOT, "Brief_Resume_Filip_Szalewicz.pdf");
const HUMAN_FULL_PDF = path.join(ROOT, "filip_szalewicz_resume_human.pdf");
const HUMAN_BRIEF_PDF = path.join(ROOT, "Brief_Resume_Filip_Szalewicz_human.pdf");

const GENERATED_ATS_FULL_TYP = path.join(GENERATED_TYPST_DIR, "resume_full_ats.typ");
const GENERATED_ATS_BRIEF_TYP = path.join(GENERATED_TYPST_DIR, "resume_brief_ats.typ");
const GENERATED_HUMAN_FULL_TYP = path.join(GENERATED_TYPST_DIR, "resume_full_human.typ");
const GENERATED_HUMAN_BRIEF_TYP = path.join(GENERATED_TYPST_DIR, "resume_brief_human.typ");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
}

function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.endsWith("\n") ? content : `${content}\n`);
}

function splitHeaderAndSections(markdown) {
  const lines = markdown.split("\n");
  const headerLines = [];
  let index = 0;

  while (index < lines.length && lines[index].trim() !== "---") {
    headerLines.push(lines[index]);
    index += 1;
  }

  while (index < lines.length && lines[index].trim() === "---") {
    index += 1;
  }

  const sections = {};
  let currentSection = null;
  let currentBody = [];

  for (; index < lines.length; index += 1) {
    const line = lines[index];

    if (line.startsWith("## ")) {
      if (currentSection) {
        sections[currentSection] = currentBody
          .filter(bodyLine => bodyLine.trim() !== "---")
          .join("\n")
          .trim();
      }
      currentSection = line.slice(3).trim();
      currentBody = [];
      continue;
    }

    if (currentSection) {
      currentBody.push(line);
    }
  }

  if (currentSection) {
    sections[currentSection] = currentBody
      .filter(bodyLine => bodyLine.trim() !== "---")
      .join("\n")
      .trim();
  }

  return {
    header: headerLines.join("\n").trim(),
    sections,
  };
}

function unwrapBoldLine(line) {
  return line.trim().replace(/^\*\*/, "").replace(/\*\*\\?$/, "").trim();
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\\$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseBulletList(body) {
  const items = [];
  let current = "";

  for (const rawLine of body.split("\n")) {
    const line = rawLine.trim();

    if (!line) {
      if (current) {
        items.push(current.trim());
        current = "";
      }
      continue;
    }

    if (line.startsWith("- ")) {
      if (current) {
        items.push(current.trim());
      }
      current = line.slice(2).trim();
      continue;
    }

    if (current) {
      current += ` ${line}`;
    }
  }

  if (current) {
    items.push(current.trim());
  }

  return items;
}

function parseSimpleLines(body) {
  return body
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.replace(/\\$/, "").trim());
}

function parseRoleBlock(block) {
  const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
  if (lines.length === 0 || !lines[0].startsWith("**")) {
    return null;
  }

  const firstLine = unwrapBoldLine(lines[0]);
  const hasSecondHeader = lines[1] && lines[1].startsWith("**");
  const secondLine = hasSecondHeader ? unwrapBoldLine(lines[1]) : "";
  const bulletBody = lines.slice(hasSecondHeader ? 2 : 1).join("\n");
  const bullets = parseBulletList(bulletBody);

  let company = firstLine;
  let location = "";
  let title = "";
  let years = "";

  if (firstLine.includes(" | ") && !secondLine) {
    [company, years] = firstLine.split(/\s+\|\s+/, 2);
  } else if (firstLine.includes(" - ")) {
    const idx = firstLine.lastIndexOf(" - ");
    company = firstLine.slice(0, idx).trim();
    location = firstLine.slice(idx + 3).trim();
  }

  if (secondLine) {
    if (secondLine.includes(" | ")) {
      [title, years] = secondLine.split(/\s+\|\s+/, 2);
    } else {
      title = secondLine;
    }
  }

  return {
    company,
    location,
    title,
    years,
    bullets,
  };
}

function parseProfessionalExperience(body) {
  return body
    .split(/\n\s*\n(?=\*\*)/g)
    .map(parseRoleBlock)
    .filter(Boolean);
}

function extractHeaderData(header) {
  const lines = header.split("\n").map(line => line.trim()).filter(Boolean);
  const name = lines[0].replace(/^#\s+/, "").trim();
  const title = stripMarkdown(lines.find(line => line.startsWith("**") && !line.includes("LinkedIn")) || "");
  const contactLine = lines.find(line => line.includes("LinkedIn")) || "";
  const location = lines[lines.length - 1] || "";

  const contactDisplay = stripMarkdown(contactLine)
    .replace(/LinkedIn:\s*/g, "")
    .replace(/Email:\s*/g, "")
    .replace(/GitHub:\s*/g, "")
    .replace(/Consulting:\s*/g, "")
    .replace(/\s+\|\s+/g, " | ")
    .trim();

  return {
    name,
    title,
    contactLine,
    location,
    headerBlock: header.trim(),
    contactsDisplay: `${location} | ${contactDisplay}`.replace(/\s+\|\s+\|/g, " | "),
  };
}

function parseResume(markdown) {
  const { header, sections } = splitHeaderAndSections(markdown);
  const headerData = extractHeaderData(header);

  return {
    ...headerData,
    sections,
    summary: (sections["Summary"] || "").replace(/\n+/g, " ").trim(),
    competencies: parseBulletList(sections["Core Competencies"] || ""),
    roles: parseProfessionalExperience(sections["Professional Experience"] || ""),
    selectedPublicWork: parseBulletList(sections["Selected Public Agentic AI Work"] || ""),
    technicalSkills: parseSimpleLines(sections["Technical Skills"] || ""),
    patents: parseBulletList(sections["Patents"] || ""),
    certifications: parseBulletList(sections["Certifications"] || ""),
    education: parseBulletList(sections["Education"] || ""),
    publicLinks: parseBulletList(sections["Public"] || ""),
  };
}

function buildBriefData(full) {
  const [solidRecent, solidEarly, shoptelligence, westMonroe, rocket, role360, earlierRoles] = full.roles;

  const solidBriefBullets = [
    ...(solidRecent?.bullets || []).slice(0, 5),
    (solidEarly?.bullets || [])[0],
  ].filter(Boolean);

  return {
    name: full.name,
    title: full.title,
    headerBlock: full.headerBlock,
    contactsDisplay: full.contactsDisplay,
    summary: full.summary,
    competencies: full.competencies.slice(0, 6),
    roles: [
      {
        company: "Solid Cage Inc",
        location: solidRecent?.location || "Macomb, MI",
        title: "Principal Consultant, Fractional CTO & SaaS Founder",
        years: "2009 - Present",
        bullets: solidBriefBullets,
      },
      {
        company: shoptelligence?.company || "Shoptelligence",
        location: shoptelligence?.location || "Ann Arbor, MI",
        title: shoptelligence?.title || "Vice President of Engineering",
        years: shoptelligence?.years || "2022 - 2025",
        bullets: (shoptelligence?.bullets || []).slice(0, 3),
      },
      {
        company: rocket?.company || "Rocket Mortgage (Quicken Loans)",
        location: rocket?.location || "Detroit, MI",
        title: rocket?.title || "Principal Engineer / Team Lead, Data Science",
        years: rocket?.years || "2017 - 2021",
        bullets: (rocket?.bullets || []).slice(0, 3),
      },
    ],
    compactRoles: [
      westMonroe ? `${westMonroe.company} - ${westMonroe.title} (${westMonroe.years})` : "",
      role360 ? `${role360.company} - ${role360.title} (${role360.years})` : "",
      earlierRoles ? "Earlier Roles: Healthcare SaaS, secure payments, enterprise reporting, integration frameworks, ERP, and industrial systems." : "",
    ].filter(Boolean),
    selectedPublicWork: full.selectedPublicWork.slice(0, 4),
    education: full.education.slice(0, 2),
    certifications: full.certifications.slice(0, 3),
    publicLinks: full.publicLinks.filter(item =>
      /GitHub:|LinkedIn:|YouTube:|Solid Cage:/i.test(item)
    ),
  };
}

function formatMarkdownBullets(items) {
  return items.map(item => `- ${item}`).join("\n");
}

function formatMarkdownRole(role) {
  return [
    `**${role.company}${role.location ? ` - ${role.location}` : ""}**\\`,
    role.title ? `**${role.title} | ${role.years}**` : `**${role.years}**`,
    formatMarkdownBullets(role.bullets),
  ].join("\n");
}

function buildBriefMarkdown(brief) {
  return [
    brief.headerBlock,
    "",
    "---",
    "",
    "## Summary",
    brief.summary,
    "",
    "---",
    "",
    "## Core Competencies",
    formatMarkdownBullets(brief.competencies),
    "",
    "---",
    "",
    "## Professional Experience",
    "",
    brief.roles.map(formatMarkdownRole).join("\n\n"),
    "",
    brief.compactRoles.join("\\\n"),
    "",
    "---",
    "",
    "## Education & Certifications",
    formatMarkdownBullets([...brief.education, ...brief.certifications]),
    "",
    "---",
    "",
    "## Public",
    formatMarkdownBullets(brief.publicLinks),
  ].join("\n");
}

function escapeTypst(text) {
  return stripMarkdown(text)
    .replace(/\\/g, "\\\\")
    .replace(/#/g, "\\#")
    .replace(/\$/g, "\\$")
    .replace(/@/g, "\\@")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/"/g, '\\"');
}

function roleToTypst(role) {
  return [
    "  #role(",
    `    ${JSON.stringify(escapeTypst(role.company))},`,
    `    ${JSON.stringify(escapeTypst(role.location || ""))},`,
    `    ${JSON.stringify(escapeTypst(role.title || ""))},`,
    `    ${JSON.stringify(escapeTypst(role.years || ""))},`,
    "    (",
    ...role.bullets.map(bullet => `      [${escapeTypst(bullet)}],`),
    "    ),",
    "  )",
  ].join("\n");
}

function typList(items, indent = "    ") {
  return items.map(item => `${indent}[${escapeTypst(item)}],`).join("\n");
}

function renderHumanFullTypst(full) {
  return [
    '#import "../common.typ": *',
    "",
    `#header(${JSON.stringify(escapeTypst(full.name))}, ${JSON.stringify(escapeTypst(full.title))}, [${escapeTypst(full.contactsDisplay)}])`,
    "",
    '#section("Summary", [',
    `  ${escapeTypst(full.summary)}`,
    "])",
    "",
    '#section("Core Competencies", [',
    "  #skill_grid((",
    ...full.competencies.map(item => `    [${escapeTypst(item)}],`),
    "  ))",
    "])",
    "",
    '#section("Professional Experience", [',
    full.roles.map(roleToTypst).join("\n\n"),
    "])",
    "",
    '#section("Selected Public Agentic AI Work", [',
    ...full.selectedPublicWork.map(item => [
      '  #public_project(',
      `    ${JSON.stringify(escapeTypst(item.split(" - ")[0].replace(/\*\*/g, "")))},`,
      `    [${escapeTypst(item.replace(/^\*\*.*?\*\*\s*-\s*/, ""))}]`,
      "  )",
    ].join("\n")),
    "])",
    "",
    '#section("Technical Skills", [',
    "  #set list(marker: [#text(fill: palette.accent)[-]])",
    "  #list(",
    typList(full.technicalSkills),
    "  )",
    "])",
    "",
    '#section("Patents, Certifications, and Education", [',
    "  #set list(marker: [#text(fill: palette.accent)[-]])",
    "  #list(",
    typList([
      `Patents: ${full.patents.join("; ")}`,
      `Certifications: ${full.certifications.join("; ")}`,
      `Education: ${full.education.join("; ")}`,
    ]),
    "  )",
    "])",
  ].join("\n");
}

function renderHumanBriefTypst(brief) {
  return [
    '#import "../common.typ": *',
    '#set page(paper: "us-letter", margin: (top: 0.5in, bottom: 0.5in, left: 0.56in, right: 0.56in))',
    '#set text(font: "Libertinus Serif", size: 9.4pt, fill: palette.ink)',
    '#set par(justify: true, leading: 0.76em)',
    '#set list(spacing: 0.38em)',
    "",
    `#header(${JSON.stringify(escapeTypst(brief.name))}, ${JSON.stringify(escapeTypst(brief.title))}, [${escapeTypst(brief.contactsDisplay)}])`,
    "",
    '#section("Summary", [',
    `  ${escapeTypst(brief.summary)}`,
    "])",
    "",
    '#section("Core Competencies", [',
    "  #skill_grid((",
    ...brief.competencies.map(item => `    [${escapeTypst(item)}],`),
    "  ))",
    "])",
    "",
    '#section("Professional Experience", [',
    brief.roles.map(roleToTypst).join("\n\n"),
    ...brief.compactRoles.map(line => `  #compact-role([${escapeTypst(line)}])`),
    "])",
    "",
    '#section("Selected Public Agentic AI Work", [',
    "  #set list(marker: [#text(fill: palette.accent)[-]])",
    "  #list(",
    typList(brief.selectedPublicWork),
    "  )",
    "])",
    "",
    '#section("Education, Certifications, and Public Links", [',
    "  #set list(marker: [#text(fill: palette.accent)[-]])",
    "  #list(",
    typList([
      `Education: ${brief.education.join("; ")}`,
      `Certifications: ${brief.certifications.join("; ")}`,
      `Public: ${brief.publicLinks.map(stripMarkdown).join(" | ")}`,
    ]),
    "  )",
    "])",
  ].join("\n");
}

function renderAtsTypst(doc, options = {}) {
  const title = options.title || doc.title;
  const sections = [];

  sections.push("= " + escapeTypst(doc.name));
  sections.push("");
  sections.push(`#text(weight: "bold")[${escapeTypst(title)}]`);
  sections.push(`#text(size: 8.8pt, fill: rgb("#475569"))[${escapeTypst(doc.contactsDisplay)}]`);
  sections.push("");
  sections.push("== Summary");
  sections.push(escapeTypst(doc.summary));
  sections.push("");
  sections.push("== Core Competencies");
  sections.push("#list(");
  sections.push(typList(doc.competencies));
  sections.push(")");
  sections.push("");
  sections.push("== Professional Experience");

  for (const role of doc.roles) {
    sections.push(`#text(weight: "bold")[${escapeTypst(role.company)}]`);
    if (role.location) {
      sections.push(`#text(size: 8.8pt, fill: rgb("#475569"))[${escapeTypst(role.location)}]`);
    }
    if (role.title || role.years) {
      sections.push(`#text(style: "italic")[${escapeTypst([role.title, role.years].filter(Boolean).join(" | "))}]`);
    }
    sections.push("#list(");
    sections.push(typList(role.bullets));
    sections.push(")");
    sections.push("");
  }

  if (doc.compactRoles && doc.compactRoles.length > 0) {
    for (const line of doc.compactRoles) {
      sections.push(`#par[${escapeTypst(line)}]`);
    }
    sections.push("");
  }

  if (doc.selectedPublicWork && doc.selectedPublicWork.length > 0) {
    sections.push("== Selected Public Agentic AI Work");
    sections.push("#list(");
    sections.push(typList(doc.selectedPublicWork));
    sections.push(")");
    sections.push("");
  }

  if (doc.technicalSkills && doc.technicalSkills.length > 0) {
    sections.push("== Technical Skills");
    sections.push("#list(");
    sections.push(typList(doc.technicalSkills));
    sections.push(")");
    sections.push("");
  }

  const educationAndCerts = [];
  if (doc.patents && doc.patents.length > 0) {
    educationAndCerts.push(`Patents: ${doc.patents.join("; ")}`);
  }
  if (doc.education && doc.education.length > 0) {
    educationAndCerts.push(...doc.education);
  }
  if (doc.certifications && doc.certifications.length > 0) {
    educationAndCerts.push(...doc.certifications);
  }
  if (doc.publicLinks && doc.publicLinks.length > 0) {
    educationAndCerts.push(...doc.publicLinks);
  }

  if (educationAndCerts.length > 0) {
    sections.push("== Education and Supporting Information");
    sections.push("#list(");
    sections.push(typList(educationAndCerts));
    sections.push(")");
    sections.push("");
  }

  return [
    '#set page(paper: "us-letter", margin: (top: 0.55in, bottom: 0.55in, left: 0.6in, right: 0.6in))',
    '#set text(font: "Libertinus Serif", size: 10pt)',
    '#set par(justify: true, leading: 0.78em)',
    '#show heading.where(level: 1): set text(weight: "bold", size: 18pt)',
    '#show heading.where(level: 2): set text(weight: "bold", size: 10.5pt)',
    '#set list(spacing: 0.34em)',
    "",
    sections.join("\n"),
  ].join("\n");
}

function findTinymistFromVscode() {
  const home = os.homedir();
  const extensionsDir = path.join(home, ".vscode", "extensions");
  if (!fs.existsSync(extensionsDir)) {
    return null;
  }

  const matches = fs.readdirSync(extensionsDir)
    .filter(name => name.startsWith("myriad-dreamin.tinymist-"))
    .sort()
    .reverse();

  for (const match of matches) {
    const candidate = path.join(extensionsDir, match, "out", "tinymist");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function resolveTypstBin() {
  const argIndex = process.argv.findIndex(arg => arg === "--typst-bin");
  if (argIndex >= 0 && process.argv[argIndex + 1]) {
    return process.argv[argIndex + 1];
  }

  const inlineArg = process.argv.find(arg => arg.startsWith("--typst-bin="));
  if (inlineArg) {
    return inlineArg.split("=")[1];
  }

  if (process.env.TYPST_BIN) {
    return process.env.TYPST_BIN;
  }

  const typstCheck = spawnSync("typst", ["--version"], { encoding: "utf8" });
  if (typstCheck.status === 0) {
    return "typst";
  }

  return findTinymistFromVscode();
}

function compileTypst(typstBin, inputPath, outputPath) {
  if (!typstBin) {
    throw new Error("No Typst or Tinymist compiler found. Set TYPST_BIN or install Typst.");
  }

  const args = ["compile", "--root", ROOT, inputPath, outputPath];
  const result = spawnSync(typstBin, args, { cwd: ROOT, encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Failed to compile ${inputPath}`);
  }
}

function main() {
  const fullMarkdown = readText(FULL_MARKDOWN);
  const full = parseResume(fullMarkdown);
  const brief = buildBriefData(full);
  const briefMarkdown = buildBriefMarkdown(brief);

  writeText(BRIEF_MARKDOWN, briefMarkdown);

  writeText(GENERATED_HUMAN_FULL_TYP, renderHumanFullTypst(full));
  writeText(GENERATED_HUMAN_BRIEF_TYP, renderHumanBriefTypst(brief));
  writeText(GENERATED_ATS_FULL_TYP, renderAtsTypst(full));
  writeText(GENERATED_ATS_BRIEF_TYP, renderAtsTypst(brief, { title: brief.title }));

  const typstBin = resolveTypstBin();
  compileTypst(typstBin, GENERATED_ATS_FULL_TYP, ATS_FULL_PDF);
  compileTypst(typstBin, GENERATED_ATS_BRIEF_TYP, ATS_BRIEF_PDF);
  compileTypst(typstBin, GENERATED_HUMAN_FULL_TYP, HUMAN_FULL_PDF);
  compileTypst(typstBin, GENERATED_HUMAN_BRIEF_TYP, HUMAN_BRIEF_PDF);
}

main();
