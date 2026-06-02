import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return existsSync(path.join(root, relativePath));
}

describe("Phase 5 template catalog", () => {
  it("provides typed Supabase data access for active templates", () => {
    const source = read("src/lib/templates.ts");

    assert.match(source, /createSupabaseServerClient/);
    assert.match(source, /getCatalogTemplates/);
    assert.match(source, /getTemplateBySlug/);
    assert.match(source, /categories/);
    assert.match(source, /is_active/);
    assert.doesNotMatch(source, /notes_internal|service_role|SUPABASE_SERVICE_ROLE_KEY/);
  });

  it("renders a public catalog page from database data", () => {
    assert.ok(exists("src/app/(public)/templates/page.tsx"));
    const page = read("src/app/(public)/templates/page.tsx");

    assert.match(page, /getCatalogTemplates/);
    assert.match(page, /Template tersedia/);
    assert.match(page, /Pilih template/);
    assert.match(page, /template-card/);
    assert.doesNotMatch(page, /undangan-minimalis.*maaf-tulus.*landing-validasi-produk/s);
  });

  it("renders a template detail page by slug with an order CTA", () => {
    assert.ok(exists("src/app/(public)/templates/[slug]/page.tsx"));
    const page = read("src/app/(public)/templates/[slug]/page.tsx");

    assert.match(page, /getTemplateBySlug/);
    assert.match(page, /notFound/);
    assert.match(page, /Pesan template/);
    assert.match(page, /form_schema/);
  });

  it("uses a reusable public template card component", () => {
    assert.ok(exists("src/components/public/template-card.tsx"));
    const card = read("src/components/public/template-card.tsx");

    assert.match(card, /TemplateCard/);
    assert.match(card, /price_idr/);
    assert.match(card, /delivery_type/);
    assert.match(card, /\/templates\/\$\{template.slug\}/);
  });
});
