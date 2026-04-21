import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const inputPath = path.resolve(projectRoot, process.argv[2] || "routes-input.json");
const outputPath = path.resolve(projectRoot, "src/data/routes.generated.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function toSafeId(raw) {
  assert(typeof raw === "string" && raw.trim().length > 0, "Node id must be a non-empty string");
  const id = raw.trim();
  assert(/^[a-z0-9_\-]+$/i.test(id), `Invalid node id: ${id}. Use letters/numbers/_/- only.`);
  return id;
}

function validateMode(mode) {
  assert(typeof mode === "string" && mode.trim().length > 0, "Edge mode must be a non-empty string");
  return mode.trim();
}

function validateMoney(value, label) {
  assert(Number.isFinite(value) && value >= 0, `${label} must be a number >= 0`);
  return value;
}

function validateMinutes(value, label) {
  assert(Number.isFinite(value) && value >= 0, `${label} must be a number >= 0`);
  return value;
}

function normalizeInput(parsed) {
  assert(isPlainObject(parsed), "Input must be a JSON object");
  assert(Array.isArray(parsed.nodes), "Input must have a 'nodes' array");
  assert(Array.isArray(parsed.edges), "Input must have an 'edges' array");

  const nodes = {};
  for (const node of parsed.nodes) {
    assert(isPlainObject(node), "Each node must be an object");
    const id = toSafeId(node.id);
    assert(typeof node.name === "string" && node.name.trim().length > 0, `Node '${id}' must have a name`);
    nodes[id] = { id, name: node.name.trim() };
  }

  const nodeIds = new Set(Object.keys(nodes));

  const edges = parsed.edges.map((edge, idx) => {
    assert(isPlainObject(edge), `Edge #${idx} must be an object`);
    const from = toSafeId(edge.from);
    const to = toSafeId(edge.to);
    assert(nodeIds.has(from), `Edge #${idx} references unknown from node '${from}'`);
    assert(nodeIds.has(to), `Edge #${idx} references unknown to node '${to}'`);

    const mode = validateMode(edge.mode);
    const fare = validateMoney(Number(edge.fare), `Edge #${idx} fare`);
    const time = validateMinutes(Number(edge.time), `Edge #${idx} time`);

    const normalized = { from, to, mode, fare, time };
    if (typeof edge.line === "string" && edge.line.trim()) normalized.line = edge.line.trim();

    return normalized;
  });

  return { nodes, edges };
}

function jsStringify(value) {
  return JSON.stringify(value, null, 2);
}

function renderModule({ nodes, edges }) {
  return `// GENERATED route graph for Timpla.\n//\n// This file is produced by scripts/import-routes.mjs from a local JSON file you provide.\n// Do not paste large third-party route datasets here unless you have permission/license.\n\nexport const NODES = ${jsStringify(nodes)};\n\nexport const EDGES = ${jsStringify(edges)};\n`;
}

async function main() {
  const raw = await readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw);
  const normalized = normalizeInput(parsed);
  const moduleText = renderModule(normalized);
  await writeFile(outputPath, moduleText, "utf8");

  console.log(`✅ Wrote ${path.relative(projectRoot, outputPath)}`);
  console.log(`   from ${path.relative(projectRoot, inputPath)}`);
}

main().catch((err) => {
  console.error("\n❌ Import failed:\n" + (err?.stack || err?.message || String(err)));
  process.exit(1);
});
