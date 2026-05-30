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
});
