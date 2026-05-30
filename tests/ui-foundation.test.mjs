import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function readText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function assertFileContains(relativePath, patterns) {
  const text = readText(relativePath);

  for (const pattern of patterns) {
    assert.match(text, pattern, `${relativePath} should include ${pattern}`);
  }

  return text;
}

describe("UI foundation contract", () => {
  it("defines non-empty brand color tokens for the app shell", () => {
    const globals = readText("src/app/globals.css");

    for (const token of [
      "--background:",
      "--foreground:",
      "--primary:",
      "--secondary:",
      "--accent:",
      "--radius:"
    ]) {
      assert.match(globals, new RegExp(token), `${token} is missing`);
    }
  });

  it("keeps shadcn aliases aligned with the source tree", () => {
    const components = readJson("components.json");

    assert.equal(components.aliases.ui, "@/components/ui");
    assert.equal(components.aliases.components, "@/components");
    assert.equal(components.aliases.utils, "@/lib/utils");
    assert.equal(components.iconLibrary, "lucide");
  });

  it("renders Indonesian landing content with primary customer actions", () => {
    const page = readText("src/app/(public)/page.tsx");

    assert.match(page, /Mauapalau/);
    assert.match(page, /Pilih template/);
    assert.match(page, /Cek pesanan/);
    assert.doesNotMatch(page, /Get started|Deploy now|Read our docs/);
  });

  it("provides shadcn-style UI primitives for Phase 2", () => {
    assertFileContains("src/components/ui/button.tsx", [
      /class-variance-authority/,
      /buttonVariants/,
      /forwardRef/
    ]);
    assertFileContains("src/components/ui/card.tsx", [
      /CardHeader/,
      /CardContent/,
      /CardFooter/
    ]);
    assertFileContains("src/components/ui/badge.tsx", [
      /badgeVariants/,
      /variant/
    ]);
  });

  it("provides app-level public components and a Framer Motion client wrapper", () => {
    assertFileContains("src/components/public/section-header.tsx", [
      /SectionHeader/,
      /eyebrow/,
      /title/
    ]);

    assertFileContains("src/components/public/motion-reveal.tsx", [
      /"use client"/,
      /framer-motion/,
      /MotionReveal/
    ]);
  });

  it("upgrades the landing page into a complete Phase 2 public UI", () => {
    const page = readText("src/app/(public)/page.tsx");

    for (const copy of [
      /Cara kerja/,
      /Template populer/,
      /Kenapa Mauapalau/,
      /Siap bikin web yang terasa personal/,
      /MotionReveal/,
      /SectionHeader/
    ]) {
      assert.match(page, copy, `landing page should include ${copy}`);
    }
  });
});
