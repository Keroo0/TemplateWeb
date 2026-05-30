# Phase 1 Scaffold TDD Scenarios

Dokumen ini mencatat skenario TDD untuk fondasi Next.js Mauapalau. Test otomatis utama ada di `tests/scaffold.test.mjs` dan dijalankan dengan `npm run test:scaffold`.

## Best-Case Scenarios

- App memakai Next.js 15, App Router, dan struktur `src/app`.
- Root layout tersedia di `src/app/layout.tsx`.
- Landing page publik tersedia di `src/app/(public)/page.tsx`.
- Copy landing page memakai Bahasa Indonesia dan menyebut Mauapalau serta CTA pilih template.
- TypeScript strict mode aktif dengan `noEmit` dan alias `@/*`.
- Tailwind dan shadcn/ui siap dipakai lewat `tailwind.config.ts`, `components.json`, `globals.css`, dan `src/lib/utils.ts`.
- Dependency utama tercatat di `package.json`: Framer Motion, lucide-react, react-hook-form, zod, Supabase SDK, Midtrans client, dan Resend.
- `.env.example` mendokumentasikan semua env penting tanpa secret asli.

## Worst-Case Scenarios

- Project memakai legacy `src/pages` atau tidak punya root layout App Router.
- `tsconfig.json` longgar, tidak strict, atau alias import rusak.
- shadcn/ui tidak bisa dipakai karena `components.json`, `cn` utility, atau CSS global hilang.
- Framer Motion atau dependency runtime utama tidak tercatat di `package.json`.
- `.env.example` kurang key penting untuk Supabase, Midtrans, Resend, admin email, atau app URL.
- `.env.example` tanpa sengaja berisi token nyata seperti JWT Supabase atau Midtrans server key.
- Landing page masih placeholder bawaan scaffold atau tidak memakai Bahasa Indonesia.

## Verification Commands

```bash
npm run test:scaffold
npm run test:ui
npm install
npm run lint
npm run typecheck
npm run build
```

Saat dokumen ini dibuat, `npm run test:scaffold` sudah dipakai untuk siklus red-green. Dependency install, lint, typecheck, dan build perlu dijalankan setelah akses npm registry tersedia.
