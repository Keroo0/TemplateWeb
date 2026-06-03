import { NextResponse } from "next/server";
import { z } from "zod";

import { buildOrderFormSchema, parseTemplateFields } from "@/lib/form-schema";
import { createOrderInputSchema, createPendingOrder, type OrderUpload } from "@/lib/orders";
import { getTemplateBySlug } from "@/lib/templates";

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return {
      body: await request.json().catch(() => null),
      uploads: [] as OrderUpload[]
    };
  }

  const formData = await request.formData();
  const payload = formData.get("payload");

  if (typeof payload !== "string") {
    return { body: null, uploads: [] as OrderUpload[] };
  }

  const uploads: OrderUpload[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("file:") || !(value instanceof File)) {
      continue;
    }

    uploads.push({
      field_name: key.replace("file:", ""),
      filename: value.name,
      mime_type: value.type,
      size_bytes: value.size,
      file: value
    });
  }

  return {
    body: JSON.parse(payload) as unknown,
    uploads
  };
}

export async function POST(request: Request) {
  const { body, uploads } = await parseRequestBody(request);
  const baseResult = createOrderInputSchema.safeParse(body);

  if (!baseResult.success) {
    return NextResponse.json(
      { error: "Data pesanan belum lengkap.", issues: baseResult.error.flatten() },
      { status: 400 }
    );
  }

  const template = await getTemplateBySlug(baseResult.data.template_slug);

  if (!template) {
    return NextResponse.json({ error: "Template tidak ditemukan." }, { status: 404 });
  }

  const fields = parseTemplateFields(template.form_schema);
  const formResult = buildOrderFormSchema(fields).safeParse(baseResult.data.form_data);

  if (!formResult.success) {
    return NextResponse.json(
      { error: "Data form belum valid.", issues: formResult.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const order = await createPendingOrder(template, {
      ...baseResult.data,
      form_data: formResult.data
    }, uploads);

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Data form belum valid.", issues: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Pesanan belum bisa dibuat. Coba lagi sebentar lagi." },
      { status: 500 }
    );
  }
}
