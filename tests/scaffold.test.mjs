import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function readText(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  return existsSync(path.join(root, relativePath));
}

describe("Phase 1 scaffold contract", () => {
  it("uses Next.js 15 App Router with src layout and Indonesian public landing copy", () => {
    const pkg = readJson("package.json");

    assert.match(pkg.dependencies.next, /^15\./);
    assert.ok(exists("src/app/layout.tsx"));
    assert.ok(exists("src/app/(public)/page.tsx"));
    assert.equal(exists("src/pages"), false);

    const page = readText("src/app/(public)/page.tsx");
    assert.match(page, /Mauapalau/);
    assert.match(page, /Pilih template/);
  });

  it("keeps TypeScript strict and path aliases ready", () => {
    const tsconfig = readJson("tsconfig.json");

    assert.equal(tsconfig.compilerOptions.strict, true);
    assert.equal(tsconfig.compilerOptions.noEmit, true);
    assert.deepEqual(tsconfig.compilerOptions.paths["@/*"], ["./src/*"]);
  });

  it("is Tailwind and shadcn ready", () => {
    const components = readJson("components.json");

    assert.ok(exists("tailwind.config.ts"));
    assert.ok(exists("src/app/globals.css"));
    assert.ok(exists("src/components/ui"));
    assert.ok(exists("src/lib/utils.ts"));
    assert.equal(components.style, "new-york");
    assert.equal(components.aliases.components, "@/components");
    assert.equal(components.aliases.utils, "@/lib/utils");
  });

  it("declares required runtime dependencies", () => {
    const deps = readJson("package.json").dependencies;

    for (const dependency of [
      "@supabase/ssr",
      "@supabase/supabase-js",
      "framer-motion",
      "lucide-react",
      "midtrans-client",
      "react-hook-form",
      "resend",
      "zod"
    ]) {
      assert.ok(deps[dependency], `${dependency} dependency is missing`);
    }
  });

  it("documents environment variables without committing local secrets", () => {
    const env = readText(".env.example");

    for (const key of [
      "NEXT_PUBLIC_APP_URL",
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "MIDTRANS_SERVER_KEY",
      "MIDTRANS_CLIENT_KEY",
      "RESEND_API_KEY",
      "ADMIN_EMAILS"
    ]) {
      assert.match(env, new RegExp(`^${key}=`, "m"), `${key} is missing`);
    }

    assert.doesNotMatch(env, /eyJ[A-Za-z0-9_-]{20,}/);
    assert.doesNotMatch(env, /SB-Mid-server-[A-Za-z0-9_-]+/);
  });
});
