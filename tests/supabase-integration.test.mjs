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

describe("Phase 4 Supabase integration", () => {
  it("uses generated Database types in browser and server clients", () => {
    const browser = read("src/lib/supabase/browser.ts");
    const server = read("src/lib/supabase/server.ts");

    assert.match(browser, /import type \{ Database \}/);
    assert.match(server, /import type \{ Database \}/);
    assert.match(browser, /createBrowserClient<Database>/);
    assert.match(server, /createServerClient<Database>/);
  });

  it("centralizes Supabase env validation and documents required keys", () => {
    const env = read("src/lib/env.ts");
    const example = read(".env.example");

    assert.match(env, /getPublicEnv/);
    assert.match(env, /getServerEnv/);
    assert.match(env, /SUPABASE_SERVICE_ROLE_KEY/);
    assert.match(example, /^ADMIN_EMAILS=/m);
    assert.match(example, /^SUPABASE_SERVICE_ROLE_KEY=/m);
  });

  it("keeps service role access server-only and out of browser clients", () => {
    const admin = read("src/lib/supabase/admin.ts");
    const browser = read("src/lib/supabase/browser.ts");

    assert.match(admin, /server-only/);
    assert.match(admin, /createClient<Database>/);
    assert.match(admin, /SUPABASE_SERVICE_ROLE_KEY/);
    assert.doesNotMatch(browser, /SERVICE_ROLE|service_role|SUPABASE_SERVICE_ROLE_KEY/);
  });

  it("provides admin auth helpers based on user email whitelist", () => {
    const auth = read("src/lib/admin-auth.ts");

    assert.match(auth, /getAdminEmails|ADMIN_EMAILS/);
    assert.match(auth, /isAdminEmail/);
    assert.match(auth, /requireAdminUser/);
    assert.match(auth, /createSupabaseServerClient/);
    assert.doesNotMatch(auth, /user_metadata/);
  });

  it("protects admin routes through middleware while leaving public routes alone", () => {
    assert.ok(exists("src/middleware.ts"), "src/middleware.ts is missing");
    const middleware = read("src/middleware.ts");

    assert.match(middleware, /\/admin/);
    assert.match(middleware, /createSupabaseMiddlewareClient/);
    assert.match(middleware, /isAdminEmail/);
    assert.match(middleware, /NextResponse\.redirect/);
    assert.doesNotMatch(middleware, /\/templates.*redirect/s);
  });
});
