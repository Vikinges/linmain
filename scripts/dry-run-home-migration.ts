/**
 * Dry run of the home-page migrations (v1.24 showcase, then v1.25 CRM-IoT beta) against a saved blocks JSON.
 *
 *   npx tsx scripts/dry-run-home-migration.ts <blocks.json> [out.json]
 *
 * Prints the resulting block order and a short summary; writes the migrated
 * blocks to out.json when given. Does not touch the database.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { applyCrmBetaV125, applyShowcaseV124 } from "../src/lib/editor/migrations"
import type { PageBlock } from "../src/lib/editor/types"

const [, , input, output] = process.argv
if (!input) {
  console.error("usage: tsx scripts/dry-run-home-migration.ts <blocks.json> [out.json]")
  process.exit(1)
}

const raw = JSON.parse(readFileSync(input, "utf8"))
const blocks = (Array.isArray(raw) ? raw : raw.blocks) as PageBlock[]

const pillars = {
  en: "<ul><li><strong>Business</strong> — 20+ years managing diverse companies.</li></ul>",
  de: "<ul><li><strong>Business</strong> — 20+ Jahre Unternehmensführung.</li></ul>",
  ru: "<ul><li><strong>Бизнес</strong> — 20+ лет управления компаниями.</li></ul>",
}

const first = applyShowcaseV124(blocks, pillars)
const second = applyCrmBetaV125(first.blocks)
const next = second.blocks
const changed = first.changed || second.changed
console.log("v1.24 changed:", first.changed, "| v1.25 changed:", second.changed)

console.log("changed:", changed)
for (const b of next) {
  let extra = ""
  if (b.type === "project") {
    extra = ` badge=${b.data.badge?.tone ?? "-"} layout=${b.data.layout ?? "side"} steps=${b.data.steps?.length ?? 0} url=${b.data.linkUrl} second=${b.data.secondaryLink?.url ?? "-"}`
  } else if (b.type === "portfolio") {
    extra = ` title="${b.data.title.en}" items=[${b.data.items.map((i) => `${i.id}(${i.kind}${i.imageUrl ? ",img" : ""})`).join(", ")}]`
  } else if (b.type === "hero") {
    extra = ` title="${b.data.title.en}" cta=${b.data.primaryCta.url}/${b.data.secondaryCta.url}`
  } else if (b.type === "cta") {
    extra = ` button="${b.data.buttonLabel.en}" → ${b.data.buttonUrl}`
  } else if (b.type === "contact") {
    extra = ` email=${b.data.email} address="${b.data.address.en}"`
  }
  console.log(`- ${b.type.padEnd(9)} ${b.id}${extra}`)
}

if (output) {
  writeFileSync(output, JSON.stringify(next, null, 2))
  console.log("written:", output)
}
